import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score

# ---------- CSV inlezen ----------
df = pd.read_csv("premier_league_matches.csv", index_col=0)

# Datumkolom correct omzetten (dayfirst=True omdat het DD/MM/YYYY is)
df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce")
df = df.dropna(subset=["date"])  # verwijder rijen zonder datum

# ---------- Categorieën en predictors ----------
# Venue: Home=1, Away=0
df["venue_home"] = (df["venue"] == "Home").astype(int)

# Optioneel: normaliseer teamnamen
class MissingDict(dict):
    def __missing__(self, key):
        return key

map_values = {
    "Brighton and Hove Albion": "Brighton",
    "Manchester United": "Manchester Utd",
    "Newcastle United": "Newcastle Utd",
    "Tottenham Hotspur": "Tottenham",
    "West Ham United": "West Ham",
    "Wolverhampton Wanderers": "Wolves"
}
mapping = MissingDict(**map_values)

df["team"] = df["team"].map(mapping)
df["opponent"] = df["opponent"].map(mapping)

# Numerieke features voor ML
df["opponent_code"] = df["opponent"].astype("category").cat.codes
df["hour"] = df["time"].str.replace(":.+", "", regex=True).astype(float)
df["day_code"] = df["date"].dt.dayofweek
df["target"] = (df["result"] == "W").astype(int)

predictors = ["venue_home", "opponent_code", "hour", "day_code"]

# ---------- Rolling averages ----------
numeric_cols = ['sh', 'sot', 'dist', 'fk', 'pk', 'pkatt', 'gf', 'ga']
new_cols = [f"{c}_rolling" for c in numeric_cols]

def rollingAverages(group, cols, new_cols):
    group = group.sort_values("date")
    valid_cols = [c for c in cols if c in group.columns]
    for col in valid_cols:
        group[col] = pd.to_numeric(group[col], errors='coerce')
    rolling_stats = group[valid_cols].rolling(3, closed="left").mean()
    for i, col in enumerate(valid_cols):
        if i < len(new_cols):
            group[new_cols[i]] = rolling_stats[col]
    group = group.dropna(subset=new_cols)
    return group

df_rolling = df.groupby("team").apply(lambda x: rollingAverages(x, numeric_cols, new_cols))
df_rolling = df_rolling.droplevel("team")
df_rolling.index = range(df_rolling.shape[0])

# ---------- Random Forest ----------
rf = RandomForestClassifier(n_estimators=50, min_samples_split=10, random_state=1)

def make_predictions(data, predictors):
    train = data[data["date"] < "2022-01-01"]
    test = data[data["date"] > "2022-01-01"]
    rf.fit(train[predictors], train["target"])
    preds = rf.predict(test[predictors])
    combined = pd.DataFrame(dict(actual=test["target"], predicted=preds), index=test.index)
    prec = precision_score(test["target"], preds)
    return combined, prec

# Home en Away splits
home_df = df_rolling[df_rolling["venue_home"] == 1]
away_df = df_rolling[df_rolling["venue_home"] == 0]

home_preds, home_prec = make_predictions(home_df, predictors + new_cols)
away_preds, away_prec = make_predictions(away_df, predictors + new_cols)

# Voeg team, opponent, date toe voor merge
home_preds = home_preds.merge(home_df[["team", "opponent", "date"]], left_index=True, right_index=True)
away_preds = away_preds.merge(away_df[["team", "opponent", "date"]], left_index=True, right_index=True)

# ---------- Combineer home/away voorspellingen ----------
combined_preds = pd.merge(
    home_preds,
    away_preds,
    left_on=["team", "opponent", "date"],
    right_on=["opponent", "team", "date"],
    suffixes=('_home', '_away'),
    how='outer'
)

# Gemiddelde voorspelling: kans dat team wint ongeacht venue
combined_preds['predicted_combined'] = (
    combined_preds['predicted_home'] + (1 - combined_preds['predicted_away'])
) / 2

# Label op basis van >0.5
combined_preds['predicted_label'] = (combined_preds['predicted_combined'] > 0.5).astype(int)

# Voorbeeld: aantal correcte voorspellingen waar home wint maar away verliest
counts = combined_preds[(combined_preds["predicted_home"] == 1) &
                        (combined_preds["predicted_away"] == 0)]["actual_home"].value_counts()


combined_preds_clean = combined_preds.dropna(subset=['predicted_label', 'actual_home'])
combined_acc = accuracy_score(combined_preds_clean['actual_home'], 
                              combined_preds_clean['predicted_label'])
print(f"\nCombined accuracy: {combined_acc:.4f}")