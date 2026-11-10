import React, { useState } from "react";
import { LAND_PATH, MAP_WIDTH, MAP_HEIGHT, mapX, mapY } from "../../data/worldMap";
import { placeLabel } from "./format";

// Where visitors are: one dot per city, bigger = more visitors.
// cities: [{ city, region, country, lat, lon, visitors, views }]
const WorldMap = ({ cities }) => {
  const [active, setActive] = useState(null);

  const placed = cities
    .filter((c) => c.lat != null && c.lon != null)
    .sort((a, b) => b.visitors - a.visitors); // small dots drawn last, on top
  const max = Math.max(1, ...placed.map((c) => c.visitors));
  const unplaced = cities.length - placed.length;

  return (
    <figure className="st-panel st-map">
      <figcaption>
        <h2>Where visitors are</h2>
        <span className="st-readout">
          {active ? (
            <>
              <b>{placeLabel(active)}</b> {active.visitors} {active.visitors === 1 ? "visitor" : "visitors"}, {active.views} page{" "}
              {active.views === 1 ? "view" : "views"}
            </>
          ) : placed.length ? (
            "Point at a dot to read the city."
          ) : (
            "No located visits in this period."
          )}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label={`Map of ${placed.length} visitor cities`}>
        <path d={LAND_PATH} className="st-land" />
        {placed.map((c) => (
          <circle
            key={`${c.city}-${c.region}-${c.country}`}
            cx={mapX(c.lon)}
            cy={mapY(c.lat)}
            r={3.5 + 9 * Math.sqrt(c.visitors / max)}
            className={active === c ? "st-dot st-dot-on" : "st-dot"}
            onMouseEnter={() => setActive(c)}
            onMouseLeave={() => setActive(null)}
          >
            <title>{`${placeLabel(c)}: ${c.visitors} visitors`}</title>
          </circle>
        ))}
      </svg>
      {unplaced > 0 && (
        <p className="ks-hint">
          {unplaced} {unplaced === 1 ? "place has" : "places have"} no known position and {unplaced === 1 ? "is" : "are"} only in the list.
        </p>
      )}
    </figure>
  );
};

export default WorldMap;
