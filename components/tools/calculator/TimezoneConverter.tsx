'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Globe, ArrowRight } from 'lucide-react';

interface CityTimezone {
  name: string;
  zone: string;
  country: string;
}

const MAJOR_CITIES: CityTimezone[] = [
  { name: 'London', zone: 'Europe/London', country: 'UK (GMT/BST)' },
  { name: 'New York', zone: 'America/New_York', country: 'US (EST/EDT)' },
  { name: 'San Francisco', zone: 'America/Los_Angeles', country: 'US (PST/PDT)' },
  { name: 'Istanbul', zone: 'Europe/Istanbul', country: 'Turkey (TRT)' },
  { name: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan (JST)' },
  { name: 'Sydney', zone: 'Australia/Sydney', country: 'Australia (AEST)' },
  { name: 'Dubai', zone: 'Asia/Dubai', country: 'UAE (GST)' },
  { name: 'Berlin', zone: 'Europe/Berlin', country: 'Germany (CET)' },
];

export function TimezoneConverter() {
  const [baseDate, setBaseDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      // update reference
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (zone: string, hourOffset = 0) => {
    try {
      const d = new Date(baseDate);
      d.setHours(selectedHour);
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Slider */}
      <div className="p-5 rounded-2xl bg-surface-200 border border-border space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-zinc-400 uppercase flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Interactive Hour Slider</span>
          </span>
          <span className="font-mono text-brand-emerald font-bold text-sm">
            {selectedHour.toString().padStart(2, '0')}:00 Local
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={23}
          value={selectedHour}
          onChange={(e) => setSelectedHour(parseInt(e.target.value))}
          className="w-full accent-brand-emerald cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>00:00 (Midnight)</span>
          <span>06:00 (Morning)</span>
          <span>12:00 (Noon)</span>
          <span>18:00 (Evening)</span>
          <span>23:00 (Night)</span>
        </div>
      </div>

      {/* Global Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {MAJOR_CITIES.map((city) => (
          <div
            key={city.name}
            className="p-4 rounded-xl bg-surface-200 border border-border flex flex-col justify-between space-y-2 shadow-sm"
          >
            <div>
              <div className="font-semibold text-sm text-zinc-100">{city.name}</div>
              <div className="text-[11px] text-zinc-400">{city.country}</div>
            </div>
            <div className="pt-2 border-t border-border/80">
              <div className="text-base font-bold font-mono text-brand-emerald">
                {formatCityTime(city.zone)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
