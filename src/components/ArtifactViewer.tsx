import type { ShareableArtifact } from '../types/shareable'

interface ArtifactViewerProps {
  data: ShareableArtifact
  onBack: () => void
}

export function ArtifactViewer({ data, onBack }: ArtifactViewerProps) {
  const totalMonthly = data.portfolioItems.reduce((s, i) => s + i.monthly, 0)
  const totalAnnual = data.portfolioItems.reduce((s, i) => s + i.annual, 0)
  const totalInput =
    data.scenario.systemTokens +
    data.scenario.userTokens +
    data.scenario.retrievedTokens +
    data.scenario.toolTokens
  const totalOutput = data.scenario.outputTokens
  const totalTokens = totalInput + totalOutput

  function handlePrint() {
    window.print()
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Shared plan</p>
          <h2>{data.scenario.name}</h2>
        </div>
        <div className="viewer-actions">
          <button type="button" className="ghost-button" onClick={handlePrint}>
            Print
          </button>
          <button type="button" className="ghost-button" onClick={onBack}>
            Return to editor
          </button>
        </div>
      </div>

      <div className="viewer-band">
        <div>
          <span>Total request tokens</span>
          <strong>{totalTokens.toLocaleString()}</strong>
        </div>
        <div>
          <span>Routing entries</span>
          <strong>{data.routingSlots.length}</strong>
        </div>
        <div>
          <span>Portfolio items</span>
          <strong>{data.portfolioItems.length}</strong>
        </div>
        <div>
          <span>Shared artifact</span>
          <strong>{data.version === 1 ? 'Current format' : 'Legacy format'}</strong>
        </div>
      </div>

      <div className="viewer-date">
        <span>Created</span>
        <strong>{new Date(data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</strong>
      </div>

      <div className="viewer-section">
        <p className="eyebrow">Scenario overview</p>
        <div className="viewer-stats-grid">
          <div>
            <span>Requests per day</span>
            <strong>{data.scenario.requestsPerDay.toLocaleString()}</strong>
          </div>
          <div>
            <span>Days per month</span>
            <strong>{data.scenario.daysPerMonth}</strong>
          </div>
          <div>
            <span>Active users</span>
            <strong>{data.scenario.activeUsers.toLocaleString()}</strong>
          </div>
          <div>
            <span>Caching</span>
            <strong>{data.scenario.useCaching ? 'Enabled' : 'Disabled'}</strong>
          </div>
          <div>
            <span>Batch mode</span>
            <strong>{data.scenario.useBatch ? 'Enabled' : 'Disabled'}</strong>
          </div>
        </div>
      </div>

      <div className="viewer-section">
        <p className="eyebrow">Token breakdown</p>
        <div className="viewer-stats-grid">
          <div>
            <span>System</span>
            <strong>{data.scenario.systemTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>User input</span>
            <strong>{data.scenario.userTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>Retrieved context</span>
            <strong>{data.scenario.retrievedTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>Tool overhead</span>
            <strong>{data.scenario.toolTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>Cached prefix</span>
            <strong>{data.scenario.cachedTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>Output</span>
            <strong>{data.scenario.outputTokens.toLocaleString()}</strong>
          </div>
          <div>
            <span>Total input</span>
            <strong>{totalInput.toLocaleString()}</strong>
          </div>
          <div>
            <span>Total output</span>
            <strong>{totalOutput.toLocaleString()}</strong>
          </div>
          <div>
            <span>Total per request</span>
            <strong>{totalTokens.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {data.routingSlots.length > 0 ? (
        <div className="viewer-section">
          <p className="eyebrow">Routing stack</p>
          <table className="viewer-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Model</th>
                <th>Traffic share</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {data.routingSlots.map((slot) => (
                <tr key={slot.roleId}>
                  <td>{slot.roleLabel}</td>
                  <td>{slot.modelId}</td>
                  <td>{slot.share}%</td>
                  <td>{slot.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {data.portfolioItems.length > 0 ? (
        <div className="viewer-section">
          <p className="eyebrow">Portfolio summary</p>
          <table className="viewer-table">
            <thead>
              <tr>
                <th>Workload</th>
                <th>Type</th>
                <th>Monthly</th>
                <th>Annual</th>
              </tr>
            </thead>
            <tbody>
              {data.portfolioItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.label}</td>
                  <td>{item.type}</td>
                  <td>${item.monthly.toFixed(2)}</td>
                  <td>${item.annual.toFixed(0)}</td>
                </tr>
              ))}
              <tr className="viewer-total-row">
                <td><strong>Total</strong></td>
                <td></td>
                <td><strong>${totalMonthly.toFixed(2)}</strong></td>
                <td><strong>${totalAnnual.toFixed(0)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
