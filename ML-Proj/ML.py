import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score


# CSV inlezen
df = pd.read_csv("premier_league_matches.csv", index_col=0)

# Datumkolom correct omzetten (dayfirst=True omdat het DD/MM/YYYY is)
df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce")

# Bekijk rijen die niet geconverteerd konden worden
# print(df[df["date"].isna()])

# Optioneel: verwijder rijen zonder datum
df = df.dropna(subset=["date"])

# print(df.dtypes)
# print(df.head())

# Aanmaken van de predictors

df["venue"] = df["venue"].astype("category").cat.codes
df["opponent"] = df["opponent"].astype("category").cat.codes
df["hour"] = df["time"].str.replace(":.+", "", regex=True).astype(float)
df["day_code"] = df["date"].dt.dayofweek
df["target"] = (df["result"] == "W").astype(int)

# Aanmaken van de ML model

rf = RandomForestClassifier(n_estimators=50, min_samples_split=10, random_state=1)

train = df[df["date"] < "2022-01-01"]

test = df[df["date"] > "2022-01-01"]

predictors = ["venue", "opponent", "hour", "day_code"]

rf.fit(train[predictors], train["target"])

preds = rf.predict(test[predictors])

# Evaluatie van het model

acc = accuracy_score(test["target"], preds)
# print (acc)


combined = pd.DataFrame(dict(actual=test["target"], predicted=preds))

# Tabel die voorspelling vs werkelijkheid toont
crosstab = pd.crosstab(index=combined["actual"], columns=combined["predicted"])
#print (crosstab)

prec = precision_score(test["target"], preds)
#print (prec)

grouped_matches = df.groupby("team")

group = grouped_matches.get_group("Arsenal")

numeric_cols = ['sh', 'sot', 'dist', 'fk', 'pk', 'pkatt', 'gf', 'ga']  # pas aan naar je kolommen
for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')  # alles wat niet kan, wordt NaN

def rollingAverages(group, cols, new_cols):
    group = group.sort_values("date")
    rolling_stats = group[cols].rolling(3, closed="left").mean()
    group [new_cols] = rolling_stats
    group = group.dropna(subset=new_cols)
    return group

# Bestaande kolommen
cols = ["gf", "ga", "sh", "sot", "dist", "pk", "pkatt"]

#` Nieuwe kolommen, waarmee de berekeningen worden opgeslagen
new_cols = [f"{c}_rolling" for c in cols]

print(rollingAverages(group, cols, new_cols))

