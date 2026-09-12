import React, { useState, useMemo } from 'react';
import type { KeypointMatch } from '../../types/registration';
import { ReticleFrame } from '../common/ReticleFrame';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, CheckCircle2, XCircle, Crosshair } from 'lucide-react';

interface KeypointsTableProps {
  keypoints: KeypointMatch[];
  selectedKeypointId?: number;
  onSelectKeypoint?: (id?: number) => void;
}

export const KeypointsTable: React.FC<KeypointsTableProps> = ({
  keypoints,
  selectedKeypointId,
  onSelectKeypoint
}) => {
  const [filterType, setFilterType] = useState<'all' | 'inliers' | 'outliers'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'id' | 'residualError' | 'confidence'>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const inlierCount = useMemo(() => keypoints.filter(k => k.isInlier).length, [keypoints]);
  const outlierCount = keypoints.length - inlierCount;

  // Filter and sort keypoints
  const filteredKeypoints = useMemo(() => {
    return keypoints
      .filter(kp => {
        if (filterType === 'inliers' && !kp.isInlier) return false;
        if (filterType === 'outliers' && kp.isInlier) return false;
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          return (
            kp.id.toString().includes(s) ||
            kp.srcX.toString().includes(s) ||
            kp.srcY.toString().includes(s) ||
            kp.refX.toString().includes(s) ||
            kp.refY.toString().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [keypoints, filterType, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredKeypoints.length / rowsPerPage) || 1;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredKeypoints.slice(start, start + rowsPerPage);
  }, [filteredKeypoints, page]);

  const handleSort = (field: 'id' | 'residualError' | 'confidence') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <ReticleFrame
      title="Correspondence Keypoint Telemetry"
      badge={`${keypoints.length} VECTORS`}
      badgeColor="neutral"
      headerRight={
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-regolith-400">Click row to center & inspect</span>
        </div>
      }
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter tabs */}
          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-obsidian-950 border border-white/10">
            <button
              onClick={() => {
                setFilterType('all');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-regolith-800 text-white font-bold'
                  : 'text-regolith-400 hover:text-white'
              }`}
            >
              All ({keypoints.length})
            </button>
            <button
              onClick={() => {
                setFilterType('inliers');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'inliers'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-regolith-400 hover:text-white'
              }`}
            >
              Inliers ({inlierCount})
            </button>
            <button
              onClick={() => {
                setFilterType('outliers');
                setPage(1);
              }}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'outliers'
                  ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                  : 'text-regolith-400 hover:text-white'
              }`}
            >
              Outliers ({outlierCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-regolith-500" />
            <input
              type="text"
              placeholder="Search by ID or coord..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-white focus:outline-none focus:border-white/30 placeholder:text-regolith-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-obsidian-900 text-regolith-400 text-[11px]">
                <th
                  onClick={() => handleSort('id')}
                  className="p-2.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>PT ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-2.5">SOURCE (X, Y)</th>
                <th className="p-2.5">REF (X, Y)</th>
                <th
                  onClick={() => handleSort('residualError')}
                  className="p-2.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>RESIDUAL (PX)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('confidence')}
                  className="p-2.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>CONFIDENCE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-2.5">CLASSIFICATION</th>
                <th className="p-2.5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-regolith-500">
                    No matching keypoints found for current filter.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((kp) => {
                  const isSelected = selectedKeypointId === kp.id;
                  return (
                    <tr
                      key={kp.id}
                      onClick={() => {
                        if (onSelectKeypoint) onSelectKeypoint(kp.id);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-white/15 text-white font-semibold'
                          : 'hover:bg-white/5 text-regolith-300'
                      }`}
                    >
                      <td className="p-2.5 font-bold text-white">
                        #{kp.id.toString().padStart(4, '0')}
                      </td>
                      <td className="p-2.5 text-regolith-200">
                        ({kp.srcX}, {kp.srcY})
                      </td>
                      <td className="p-2.5 text-regolith-200">
                        ({kp.refX}, {kp.refY})
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`font-bold ${
                            kp.residualError < 1.0
                              ? 'text-telemetry-green'
                              : kp.residualError < 2.5
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {kp.residualError.toFixed(2)} px
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-12 bg-obsidian-900 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-white h-full"
                              style={{ width: `${kp.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] text-regolith-300">{(kp.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-2.5">
                        {kp.isInlier ? (
                          <span className="inline-flex items-center space-x-1 text-telemetry-green bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>INLIER</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-[10px]">
                            <XCircle className="w-3 h-3" />
                            <span>OUTLIER</span>
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectKeypoint) onSelectKeypoint(kp.id);
                          }}
                          className="p-1 rounded hover:bg-white/10 text-regolith-400 hover:text-white cursor-pointer"
                          title="Center in Viewfinder"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between text-regolith-400 text-xs">
          <span>
            Showing {(page - 1) * rowsPerPage + 1} to{' '}
            {Math.min(page * rowsPerPage, filteredKeypoints.length)} of {filteredKeypoints.length}{' '}
            correspondences
          </span>

          <div className="flex items-center space-x-1">
            <button
              disabled={page <= 1}
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
              }}
              className="p-1.5 rounded bg-obsidian-950 border border-white/10 hover:border-white/30 text-regolith-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-white font-bold">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
              }}
              className="p-1.5 rounded bg-obsidian-950 border border-white/10 hover:border-white/30 text-regolith-300 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </ReticleFrame>
  );
};
