'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Network, Server, Shield, Check, AlertCircle, Hash, Globe } from 'lucide-react';

function ipToLong(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (let i = 0; i < 4; i++) {
    const octet = parseInt(parts[i], 10);
    if (isNaN(octet) || octet < 0 || octet > 255 || (parts[i].length > 1 && parts[i].startsWith('0'))) {
      return null;
    }
    num = (num << 8) | octet;
  }
  return num >>> 0;
}

function longToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

function toBinaryString(num: number): string {
  return [
    ((num >>> 24) & 255).toString(2).padStart(8, '0'),
    ((num >>> 16) & 255).toString(2).padStart(8, '0'),
    ((num >>> 8) & 255).toString(2).padStart(8, '0'),
    (num & 255).toString(2).padStart(8, '0'),
  ].join('.');
}

interface SubnetInfo {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkIp: string;
  broadcastIp: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipType: 'Private (RFC 1918)' | 'Public Internet' | 'Loopback (RFC 1122)' | 'Link-Local' | 'Multicast';
  binaryIp: string;
  binaryNetmask: string;
}

function calculateSubnet(input: string, prefixArg?: number): SubnetInfo | null {
  let ip = input.trim();
  let cidr = prefixArg ?? 24;

  if (ip.includes('/')) {
    const parts = ip.split('/');
    ip = parts[0].trim();
    const parsedCidr = parseInt(parts[1], 10);
    if (!isNaN(parsedCidr) && parsedCidr >= 0 && parsedCidr <= 32) {
      cidr = parsedCidr;
    }
  }

  const ipNum = ipToLong(ip);
  if (ipNum === null) return null;

  const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardNum = (~maskNum) >>> 0;
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | wildcardNum) >>> 0;

  const totalHosts = Math.pow(2, 32 - cidr);
  let usableHosts = 0;
  let firstUsableNum = networkNum;
  let lastUsableNum = broadcastNum;

  if (cidr <= 30) {
    usableHosts = totalHosts - 2;
    firstUsableNum = (networkNum + 1) >>> 0;
    lastUsableNum = (broadcastNum - 1) >>> 0;
  } else if (cidr === 31) {
    usableHosts = 2; // RFC 3021
    firstUsableNum = networkNum;
    lastUsableNum = broadcastNum;
  } else if (cidr === 32) {
    usableHosts = 1;
    firstUsableNum = networkNum;
    lastUsableNum = networkNum;
  }

  // Determine Class
  const firstOctet = (ipNum >>> 24) & 255;
  let ipClass = 'Class A';
  if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'Class B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'Class C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'Class D (Multicast)';
  else if (firstOctet >= 240) ipClass = 'Class E (Experimental)';

  // Determine IP Type
  let ipType: SubnetInfo['ipType'] = 'Public Internet';
  if (firstOctet === 10) {
    ipType = 'Private (RFC 1918)';
  } else if (firstOctet === 172 && ((ipNum >>> 16) & 255) >= 16 && ((ipNum >>> 16) & 255) <= 31) {
    ipType = 'Private (RFC 1918)';
  } else if (firstOctet === 192 && ((ipNum >>> 16) & 255) === 168) {
    ipType = 'Private (RFC 1918)';
  } else if (firstOctet === 127) {
    ipType = 'Loopback (RFC 1122)';
  } else if (firstOctet === 169 && ((ipNum >>> 16) & 255) === 254) {
    ipType = 'Link-Local';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipType = 'Multicast';
  }

  return {
    ip,
    cidr,
    netmask: longToIp(maskNum),
    wildcard: longToIp(wildcardNum),
    networkIp: longToIp(networkNum),
    broadcastIp: longToIp(broadcastNum),
    firstUsableIp: longToIp(firstUsableNum),
    lastUsableIp: longToIp(lastUsableNum),
    totalHosts,
    usableHosts,
    ipClass,
    ipType,
    binaryIp: toBinaryString(ipNum),
    binaryNetmask: toBinaryString(maskNum),
  };
}

const PRESETS = [
  { name: 'Home / SOHO Network', cidr: '192.168.1.0/24' },
  { name: 'AWS VPC / Docker Network', cidr: '172.16.0.0/16' },
  { name: 'Corporate Enterprise Network', cidr: '10.0.0.0/8' },
  { name: 'Small Cloud Subnet (/28)', cidr: '10.0.1.0/28' },
  { name: 'Point-to-Point Link (/30)', cidr: '192.168.10.4/30' },
  { name: 'Host / Loopback (/32)', cidr: '127.0.0.1/32' },
];

export function CidrSubnetCalculator() {
  const [inputVal, setInputVal] = useState('192.168.1.1/24');
  const [prefix, setPrefix] = useState(24);

  const subnet = useMemo(() => {
    return calculateSubnet(inputVal, prefix);
  }, [inputVal, prefix]);

  const handleInputChange = (val: string) => {
    setInputVal(val);
    if (val.includes('/')) {
      const p = parseInt(val.split('/')[1], 10);
      if (!isNaN(p) && p >= 0 && p <= 32) {
        setPrefix(p);
      }
    }
  };

  const handlePrefixChange = (p: number) => {
    setPrefix(p);
    const ipOnly = inputVal.split('/')[0];
    setInputVal(`${ipOnly}/${p}`);
  };

  return (
    <div className="space-y-6">
      {/* Input Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-brand-emerald" />
            IPv4 Address & CIDR Prefix
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Subnet Mask:</span>
            <select
              value={prefix}
              onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-xl text-brand-emerald font-mono text-xs focus:outline-none"
            >
              {Array.from({ length: 33 }, (_, i) => 32 - i).map((bit) => (
                <option key={bit} value={bit}>
                  /{bit} ({Math.pow(2, 32 - bit).toLocaleString()} IPs)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="e.g. 192.168.1.1/24 or 10.0.0.1"
            className="w-full px-4 py-3.5 bg-black/60 border border-zinc-700 rounded-xl text-brand-emerald font-mono text-xl sm:text-2xl tracking-wide focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
          />
        </div>

        {/* Status indicator */}
        {subnet ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-brand-emerald/10 text-brand-emerald font-bold border border-brand-emerald/20">
                {subnet.ipType}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-semibold">{subnet.ipClass}</span>
            </div>
            <span className="text-zinc-500">
              {subnet.usableHosts.toLocaleString()} Usable Host Addresses
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Invalid IPv4 address format. Please enter four numbers (0-255) separated by dots.</span>
          </div>
        )}
      </div>

      {/* Main Calculated Results Table */}
      {subnet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IP & Addressing Details */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-emerald" />
              Network & Routing Boundaries
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Network Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{subnet.networkIp}</span>
                  <CopyButton text={subnet.networkIp} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Broadcast Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{subnet.broadcastIp}</span>
                  <CopyButton text={subnet.broadcastIp} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Subnet Netmask:</span>
                <div className="flex items-center gap-2">
                  <span className="text-brand-emerald font-bold">{subnet.netmask}</span>
                  <CopyButton text={subnet.netmask} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Wildcard Mask:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300">{subnet.wildcard}</span>
                  <CopyButton text={subnet.wildcard} />
                </div>
              </div>
            </div>
          </div>

          {/* Usable Range & Host Capacity */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4 text-brand-emerald" />
              Usable Host Range & Capacity
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">First Usable IP:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{subnet.firstUsableIp}</span>
                  <CopyButton text={subnet.firstUsableIp} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Last Usable IP:</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{subnet.lastUsableIp}</span>
                  <CopyButton text={subnet.lastUsableIp} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Usable Hosts:</span>
                <span className="text-white font-bold">{subnet.usableHosts.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-400">Total IP Count:</span>
                <span className="text-zinc-400">{subnet.totalHosts.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Binary Representation */}
      {subnet && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            32-Bit Binary Representation
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-zinc-500">IP Binary:</span>
              <span className="text-brand-emerald tracking-wider select-all">{subnet.binaryIp}</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-zinc-500">Mask Binary:</span>
              <span className="text-zinc-300 tracking-wider select-all">{subnet.binaryNetmask}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Standard Architecture Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleInputChange(p.cidr)}
              className="p-3 rounded-xl bg-zinc-950/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-colors text-left group"
            >
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-brand-emerald transition-colors">
                {p.name}
              </div>
              <div className="text-[11px] font-mono text-brand-emerald mt-1">{p.cidr}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
