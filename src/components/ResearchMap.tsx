import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Paper {
  title: string;
  slug: string;
  type: 'publication' | 'working-paper';
}

interface FieldSite {
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  projects: string[];
  papers: Paper[];
}

interface Props {
  sites: FieldSite[];
}

// Project → color mapping
const PROJECT_COLORS: Record<string, string> = {
  'Shadow of the Future': '#0d9488',   // teal-600
  'BehaviorChange': '#d97706',         // amber-600
  'Local Leaders in Namibia': '#7c3aed', // violet-600
  'IMPACTED': '#dc2626',               // red-600
};

const DEFAULT_COLOR = '#3b82f6'; // blue-500

function getMarkerColor(projects: string[]): string {
  if (projects.length === 0) return DEFAULT_COLOR;
  return PROJECT_COLORS[projects[0]] || DEFAULT_COLOR;
}

// Tile URLs
const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
};

/** Watches the <html> class list for dark mode changes */
function useDarkMode(): boolean {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

/** Swaps tile layer when dark mode toggles */
function DynamicTiles() {
  const dark = useDarkMode();
  const map = useMap();
  const tiles = dark ? TILES.dark : TILES.light;

  // Force Leaflet to re-render tiles on theme change
  useEffect(() => {
    map.invalidateSize();
  }, [dark, map]);

  return <TileLayer key={dark ? 'dark' : 'light'} url={tiles.url} attribution={tiles.attribution} />;
}

// Legend badge colors (matching PROJECT_COLORS)
const LEGEND_ITEMS = [
  { label: 'Shadow of the Future', color: '#0d9488' },
  { label: 'BehaviorChange', color: '#d97706' },
  { label: 'Local Leaders', color: '#7c3aed' },
  { label: 'IMPACTED', color: '#dc2626' },
  { label: 'Other', color: '#3b82f6' },
];

export default function ResearchMap({ sites }: Props) {
  return (
    <div className="relative">
      <MapContainer
        center={[12, 45]}
        zoom={2}
        minZoom={2}
        scrollWheelZoom={false}
        style={{ height: '450px', width: '100%', borderRadius: '0.75rem' }}
        className="z-0"
      >
        <DynamicTiles />
        {sites.map((site) => {
          const color = getMarkerColor(site.projects);
          return (
            <CircleMarker
              key={site.name}
              center={[site.lat, site.lng]}
              radius={8}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.85,
              }}
            >
              <Popup>
                <div style={{ minWidth: 180, fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>
                    {site.name}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: '4px 0 8px', lineHeight: 1.45 }}>
                    {site.description}
                  </p>
                  {site.projects.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {site.projects.map((p) => (
                        <span
                          key={p}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 9999,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            backgroundColor: `${PROJECT_COLORS[p] || DEFAULT_COLOR}20`,
                            color: PROJECT_COLORS[p] || DEFAULT_COLOR,
                            border: `1px solid ${PROJECT_COLORS[p] || DEFAULT_COLOR}40`,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                  {site.papers.length > 0 && (
                    <div style={{ marginTop: 8, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Papers
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {site.papers.map((paper) => (
                          <li key={paper.slug} style={{ marginBottom: 3 }}>
                            <a
                              href={paper.type === 'publication' ? `/publications/${paper.slug}` : '/working-papers'}
                              style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'none', lineHeight: 1.35, display: 'block' }}
                              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            >
                              {paper.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Projects</div>
        <div className="space-y-1">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
