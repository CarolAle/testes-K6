
## About

study of performance tests with k6.


## How to run

Clone the repository, install dependencies

running the API

```
cd api
npx serverest@latest
```

running tests
```
k6 run signup-smoke.js
```


## A summary of Performance Testing

Smoke tests validate that your script and system function properly under minimal load.

Load testing evaluates your system's performance under constant or increasing load - expected normal conditions.

Stress tests evaluate a system's performance at its limits when load exceeds the expected average.

Immersion tests evaluate your system's reliability and performance over long periods.

Spike testing validates your system's behavior and survivability in cases of sudden, short, and massive increases in activity.

Breakpoint tests gradually increase load to identify system capacity limits.