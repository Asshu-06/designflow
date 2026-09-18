// src/data/starterTemplates.ts
import type { SupportedLanguage } from '../components/practice/CodeEditorPanel';

export const STARTER_TEMPLATES: Record<string, Record<SupportedLanguage, string>> = {
  'parking-lot': {
    java: `// Parking Lot System - Low Level Design (Java 17)
import java.util.*;

enum VehicleType { MOTORCYCLE, COMPACT, LARGE, EV }
enum SpotType { MOTORCYCLE, COMPACT, LARGE, EV }

class Vehicle {
    private String licensePlate;
    private VehicleType type;

    public Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
    
    public VehicleType getType() { 
        return type; 
    }
}

class ParkingSpot {
    private String id;
    private SpotType type;
    private boolean isOccupied;

    public ParkingSpot(String id, SpotType type) {
        this.id = id;
        this.type = type;
        this.isOccupied = false;
    }

    public boolean assignVehicle(Vehicle v) {
        // TODO: Implement spot assignment logic
        return false;
    }

    public boolean canFit(VehicleType vType) {
        // TODO: Implement vehicle size matching logic
        return false;
    }
}

public class ParkingLot {
    private List<ParkingSpot> spots = new ArrayList<>();

    public boolean parkVehicle(Vehicle v) {
        // TODO: Implement parking allocation strategy across levels/spots
        return false;
    }
}`,
    typescript: `// Parking Lot System - Low Level Design (TypeScript 5)
export type VehicleType = 'MOTORCYCLE' | 'COMPACT' | 'LARGE' | 'EV';
export type SpotType = 'MOTORCYCLE' | 'COMPACT' | 'LARGE' | 'EV';

export class Vehicle {
  constructor(public licensePlate: string, public type: VehicleType) {}
}

export class ParkingSpot {
  public isOccupied = false;
  constructor(public id: string, public type: SpotType) {}

  public canFit(vType: VehicleType): boolean {
    // TODO: Implement vehicle size matching logic
    return false;
  }
}

export class ParkingLot {
  private spots: ParkingSpot[] = [];

  public parkVehicle(v: Vehicle): boolean {
    // TODO: Implement parking spot assignment strategy
    return false;
  }
}`,
    python: `# Parking Lot System - Low Level Design (Python 3.11)
from enum import Enum
from typing import List, Optional

class VehicleType(Enum):
    MOTORCYCLE = 1
    COMPACT = 2
    LARGE = 3
    EV = 4

class Vehicle:
    def __init__(self, license_plate: str, vehicle_type: VehicleType):
        self.license_plate = license_plate
        self.vehicle_type = vehicle_type

class ParkingSpot:
    def __init__(self, spot_id: str, spot_type: VehicleType):
        self.spot_id = spot_id
        self.spot_type = spot_type
        self.is_occupied = False

class ParkingLot:
    def __init__(self):
        self.spots: List[ParkingSpot] = []

    def park_vehicle(self, vehicle: Vehicle) -> bool:
        # TODO: Implement parking spot assignment strategy
        return False`,
    cpp: `// Parking Lot System - Low Level Design (C++ 20)
#include <iostream>
#include <vector>
#include <string>

enum class VehicleType { MOTORCYCLE, COMPACT, LARGE, EV };

class Vehicle {
public:
    std::string licensePlate;
    VehicleType type;
    Vehicle(std::string plate, VehicleType t) : licensePlate(plate), type(t) {}
};

class ParkingLot {
public:
    bool parkVehicle(const Vehicle& v) {
        // TODO: Implement parking spot assignment logic
        return false;
    }
};`,
    go: `// Parking Lot System - Low Level Design (Go 1.22)
package main

type VehicleType int

const (
	Motorcycle VehicleType = iota
	Compact
	Large
	EV
)

type Vehicle struct {
	LicensePlate string
	Type         VehicleType
}

type ParkingLot struct {
	Spots []Vehicle
}

func (p *ParkingLot) ParkVehicle(v Vehicle) bool {
	// TODO: Implement parking allocation strategy
	return false
}`,
  },
};

export function getStarterTemplate(slug: string, lang: SupportedLanguage): string {
  if (STARTER_TEMPLATES[slug] && STARTER_TEMPLATES[slug][lang]) {
    return STARTER_TEMPLATES[slug][lang];
  }
  return `// Low-Level Design Implementation (${lang.toUpperCase()})
// Write clean domain classes, interfaces, and methods for ${slug}

public class Solution {
    // Write your code here
}`;
}
