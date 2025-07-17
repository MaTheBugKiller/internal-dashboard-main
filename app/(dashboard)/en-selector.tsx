'use client';
import { Environment } from 'app/types/common';
import { useEnvironment } from './env-provider';

export function EnvironmentSelector() {
  const { environment, setEnvironment } = useEnvironment();

  return (
    <div className="flex items-center space-x-2">
      <select 
        value={environment}
        onChange={(e) => setEnvironment(e.target.value as Environment)}
        className="h-10 rounded-md border px-2 py-2"
      >
        <option value="dev">Development</option>
        <option value="uat">UAT</option>
        <option value="prod">Production</option>
      </select>
    </div>
  );
}