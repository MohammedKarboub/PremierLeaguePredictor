export default function Uploader() {
  return (
    <div className="uploader">
      <div className="card">
        <h4>Upload removed</h4>
        <p className="muted">CSV upload has been disabled. The app loads the dataset from the server's <code>/api/matches</code>. To use a different CSV, place it in the project root (or the parent) and restart the server.</p>
      </div>
    </div>
  )
}
