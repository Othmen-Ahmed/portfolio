# Kiln simulator: sources and assumptions

Generic 5,000 t/d dry-process line: 5-stage preheater, calciner with tertiary air duct, rotary kiln, reciprocating grate cooler.

## Plant values

| Item | Value used | Basis |
|---|---|---|
| Clinker output | 209 t/h (5,000 t/d) | Design basis |
| Raw meal : clinker | 1.6, so 335 t/h kiln feed | Typical 1.55–1.65 |
| Fuel split kiln / calciner | 40 / 60 % | Plant operation handbooks: "kiln about 40 %, pre-calciner about 60 %" |
| Coal NCV | 6,000 kcal/kg | Typical bituminous coal |
| Specific heat | about 720 kcal/kg | 5-stage precalciner kilns: 700–775 kcal/kg |
| Kiln speed | 3.8 rpm | Precalciner kilns about 3.5 rpm (3.3–4.5 rpm design range) |
| Kiln residence time | 20–25 min (feed effect on burning zone delayed 15 min) | Precalciner kiln guidelines |
| Kiln inlet O₂ | 1.6–3.2 % operating range, 2.2 % nominal | Kiln inlet O₂ typically 1–3 %; with a good flame CO below 200 ppm |
| CO trip | 1 % (10,000 ppm) at the preheater exit, alarms at 2,000 / 5,000 ppm | Plant practice for a line with an electrostatic precipitator (confirmed by A. Othman, SINOMA Cement) |
| Burning zone | 1,450 °C target | Sintering at 1,400–1,500 °C (Stadler et al. 2011) |
| Calciner outlet | 860–900 °C, calcination about 93 % | Typical precalciner operation |
| Cyclone 1 outlet | about 320 °C | About 330 °C for a 5-stage preheater |
| Secondary air | about 1,050 °C | 800–1,050 °C typical |
| Cooler chamber 2 pressure | 58 mbar, high-high at 73 mbar | Zanoli et al. 2023 use a 73 mbar threshold as a KPI |
| Free lime | 0.8–1.5 % band | Zanoli et al. 2023: target 0.8–1.2 % |

## Dynamics

| Path | Model | Basis |
|---|---|---|
| Kiln coal → burning zone | dead time 160 s, fast mode τ = 36 min (70 %), slow refractory mode τ = 5.3 h (30 %) | Svensen et al. 2026, Table 1: θ = 162 s, τ1 = 2,153 s, τ2 = 19,192 s. Share of the slow mode reduced to 30 % so the kiln responds on the 20–40 min scale operators report; about 35 min confirmed by plant experience (A. Othman) |
| Gain kiln coal → burning zone | about 26 °C per t/h | Svensen et al. 2026: 103 K per kg/s, i.e. 29 K per t/h |
| Fan / air → O₂ | dead time 30 s (analyser), τ 45–60 s | Fast gas path (Svensen et al. 2026: τ in seconds) plus sampling-probe delay |
| Calciner coal → calciner temperature | τ 90 s | Fast calciner combustion |
| Grate → chamber pressure | τ 4 min | Local PID loop (Zanoli et al. 2023, Tsamatsoulis 2021) |
| Lab free lime | hourly sample, result after 15 min, material delay 25 min | Practice |

## APC

- Dynamic Matrix Control (step-response MPC), sample time 60 s as in Zanoli et al. 2023.
- FOPDT models for each MV–CV pair (Zanoli et al. 2023 identify FOPDT models from step tests).
- MVs: kiln feed, main burner coal, calciner coal, ID fan. Feed is fully under APC: production is maximized as the lowest-priority objective, so feed rises until a constraint binds (typically ID fan at 95 %), as in Stadler et al. 2011 where the MPC kept feed near its maximum. CVs: burning zone (setpoint), kiln inlet O₂ (range), preheater exit O₂ (range), calciner outlet (setpoint).
- Cost: weighted tracking with "equal concern errors", move suppression, a feed target, receding horizon, move blocking.
- A CO expert rule raises the O₂ lower limits when CO rises (ABB Expert Optimizer combines MPC with rule-based logic).

## Benchmark shown in the Results tab

Stadler, K.S., Poland, J., Gallestey, E. (2011). Model predictive control of a rotary cement kiln. Control Engineering Practice 19, 1–9. Table 1, 10-day periods at Holcim Siggenthal: burning zone SD 6.38 → 2.94 °C, within ±0.5 % 86.7 → 97.7 %, O₂ SD 0.93 → 0.39 %, specific energy SD 439.9 → 76.1 kJ/kg, feed SD 11.88 → 0.36 % of maximum.

## References

- Stadler, Poland, Gallestey (2011), Control Engineering Practice 19(1), 1–9.
- Zanoli, Pepe, Astolfi (2023), Advanced Process Control for Clinker Rotary Kiln and Grate Cooler, Sensors 23(5), 2805.
- Svensen, Hørsholt, Muralidharan, Jørgensen (2026), A simulation- and model-based approach to PI control pairing and tuning for the pyro process in a cement plant, arXiv:2605.03489.
- Peray, K.E. (1986), The Rotary Cement Kiln, 2nd ed.
- Alsop, P.A. (ed.), Cement Plant Operations Handbook.
