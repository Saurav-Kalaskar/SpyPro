// utils/floorEstimation.ts
interface BuildingConfig {
    groundLevelAltitude: number;  // Ground level altitude in meters
    averageFloorHeight: number;   // Average floor height in meters
    maxFloors: number;            // Maximum number of floors to prevent unrealistic estimates
}

export const defaultBuildingConfig: BuildingConfig = {
    groundLevelAltitude: 0,       // Will be updated with actual ground level
    averageFloorHeight: 3,        // Standard floor height ~3 meters
    maxFloors: 200               // Reasonable maximum for most buildings
};

export function estimateFloorLevel(
    altitude: number,
    config: BuildingConfig = defaultBuildingConfig
): number | null {
    if (!altitude || altitude < config.groundLevelAltitude) {
        return null;
    }

    const relativeHeight = altitude - config.groundLevelAltitude;
    const estimatedFloor = Math.round(relativeHeight / config.averageFloorHeight);

    // Validate the estimated floor
    if (estimatedFloor < 0 || estimatedFloor > config.maxFloors) {
        return null;
    }

    return estimatedFloor;
}

export function calibrateGroundLevel(
    groundLevelSamples: number[]
): number {
    if (!groundLevelSamples.length) {
        return defaultBuildingConfig.groundLevelAltitude;
    }

    // Use median value to avoid outliers
    const sortedSamples = [...groundLevelSamples].sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedSamples.length / 2);

    return sortedSamples[middleIndex];
}