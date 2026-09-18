// src/pages/ResourcesPage.tsx
import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { FileCode2, BookOpen, Layers, CheckCircle2, Copy } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const solidPrinciples = [
    {
      letter: 'S',
      title: 'Single Responsibility Principle (SRP)',
      summary: 'A class should have one, and only one, reason to change.',
      example: 'Separate FeeCalculator from ParkingSpotManager and GateController.',
    },
    {
      letter: 'O',
      title: 'Open/Closed Principle (OCP)',
      summary: 'Software entities should be open for extension, but closed for modification.',
      example: 'Use Strategy pattern for PaymentProcessor so new payment gateways can be added without modifying existing checkout code.',
    },
    {
      letter: 'L',
      title: 'Liskov Substitution Principle (LSP)',
      summary: 'Derived classes must be substitutable for their base classes without breaking behavior.',
      example: 'MotorcycleSpot and LargeSpot must honor all contracts defined in abstract ParkingSpot.',
    },
    {
      letter: 'I',
      title: 'Interface Segregation Principle (ISP)',
      summary: 'Clients should not be forced to depend on methods they do not use.',
      example: 'Separate Printer and Scanner interfaces instead of a fat MultiFunctionDevice interface.',
    },
    {
      letter: 'D',
      title: 'Dependency Inversion Principle (DIP)',
      summary: 'High-level modules should not depend on low-level modules. Both should depend on abstractions.',
      example: 'ElevatorController depends on IDispatchAlgorithm interface, not concrete ScanAlgorithm.',
    },
  ];

  const patterns = [
    {
      name: 'Strategy Pattern',
      category: 'Behavioral',
      useCase: 'Dynamic algorithm swapping (e.g., LOOK/SCAN vs SSTF elevator dispatching, pricing engines).',
      code: `interface IPricingStrategy {\n  calculateFee(ticket: Ticket): number;\n}`,
    },
    {
      name: 'State Pattern',
      category: 'Behavioral',
      useCase: 'Managing complex lifecycle state transitions (e.g., Vending Machine: IdleState, HasMoneyState, DispensingState).',
      code: `interface VendingState {\n  insertMoney(coin: Coin): void;\n  selectItem(code: string): void;\n  dispense(): void;\n}`,
    },
    {
      name: 'Observer Pattern',
      category: 'Behavioral',
      useCase: 'Publishing availability notifications to subscribers (e.g., Book reservation queue, Elevator floor displays).',
      code: `interface DisplayObserver {\n  update(floor: number, direction: Direction): void;\n}`,
    },
    {
      name: 'Factory Method Pattern',
      category: 'Creational',
      useCase: 'Decoupling object instantiation based on runtime parameters (e.g., VehicleFactory creating Compact, Large, or EV vehicles).',
      code: `class VehicleFactory {\n  static createVehicle(type: VehicleType): Vehicle;\n}`,
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[#8B9CF6] font-mono text-xs mb-1">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Technical Reference Manual</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">LLD Architecture Resources</h1>
        <p className="text-[#9CA3AF] text-xs mt-1">
          Quick-reference cheat sheet for SOLID principles, GoF design patterns, and system modularity contracts.
        </p>
      </div>

      {/* SOLID Section */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-[#8B9CF6] flex items-center space-x-2 border-b border-[#262C34] pb-3">
          <BookOpen className="w-4 h-4 text-[#8B9CF6]" />
          <span>SOLID Design Principles Reference</span>
        </h2>

        <div className="space-y-3">
          {solidPrinciples.map((item, idx) => (
            <div key={idx} className="bg-[#0B0D0F] border border-[#262C34] rounded-md p-3.5 space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded bg-[#8B9CF6]/10 border border-[#8B9CF6]/30 text-[#8B9CF6] font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {item.letter}
                </span>
                <h3 className="font-bold text-[#F3F4F6] text-xs">{item.title}</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] pl-8 leading-relaxed">{item.summary}</p>
              <div className="pl-8 text-[11px] font-mono text-[#8B9CF6]/90 bg-[#171B21] p-2 rounded border border-[#262C34]">
                <span className="text-[#667085] font-sans">Example: </span>
                {item.example}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Design Patterns Section */}
      <Card className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-[#8B9CF6] flex items-center space-x-2 border-b border-[#262C34] pb-3">
          <Layers className="w-4 h-4 text-[#8B9CF6]" />
          <span>Essential GoF Low-Level Design Patterns</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((p, idx) => (
            <div key={idx} className="bg-[#0B0D0F] border border-[#262C34] rounded-md p-3.5 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-[#F3F4F6] text-xs font-mono">{p.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171B21] border border-[#262C34] text-[#8B9CF6]">
                    {p.category}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] leading-relaxed mb-3">{p.useCase}</p>
              </div>

              <div className="relative bg-[#111418] border border-[#262C34] p-2.5 rounded font-mono text-[11px] text-[#F3F4F6]">
                <button
                  onClick={() => handleCopy(p.code, idx)}
                  className="absolute top-2 right-2 p-1 text-[#9CA3AF] hover:text-[#F3F4F6] rounded hover:bg-[#171B21]"
                  title="Copy snippet"
                >
                  {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-[#35C98B]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="overflow-x-auto whitespace-pre-wrap">{p.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
