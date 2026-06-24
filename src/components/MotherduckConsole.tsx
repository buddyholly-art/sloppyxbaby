import { useState } from "react";
import { Database, RefreshCw } from "lucide-react";

interface MotherduckConsoleProps {
  sqlQuery: string;
  setSqlQuery: (q: string) => void;
  sqlResult: { columns: string[]; rows: any[][] } | null;
  sqlError: string | null;
  sqlLoading: boolean;
  executeSqlQuery: (q?: string) => Promise<void>;
}

export default function MotherduckConsole({
  sqlQuery,
  setSqlQuery,
  sqlResult,
  sqlError,
  sqlLoading,
  executeSqlQuery
}: MotherduckConsoleProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="motherduck-sandbox">
      
      {/* Left Column: Schema and Table Specs */}
      <div className="lg:col-span-4 bg-slate-900/40 p-5 border border-slate-800/80 rounded-2xl h-fit space-y-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Catalog Schema</span>
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal font-sans">
            Database schema structure for compiled prompt files.
          </p>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden text-xs bg-slate-950/80">
          <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
            🗂️ Tables in database_vault
          </div>
          <div className="p-3 space-y-3">
            <div className="space-y-1">
              <span className="font-mono text-emerald-400 font-bold text-[11px]">table: prompts</span>
              <div className="pl-3 border-l border-indigo-500/20 space-y-1 text-[10px] text-slate-400 font-mono">
                <p className="flex justify-between"><span>id</span> <span className="text-slate-650">VARCHAR</span></p>
                <p className="flex justify-between"><span>title</span> <span className="text-slate-650">VARCHAR</span></p>
                <p className="flex justify-between"><span>originalInput</span> <span className="text-slate-500">VARCHAR</span></p>
                <p className="flex justify-between"><span>advocatePrompt</span> <span className="text-slate-500">VARCHAR</span></p>
                <p className="flex justify-between"><span>promptScore</span> <span className="text-slate-650">INT</span></p>
                <p className="flex justify-between"><span>caliberStatus</span> <span className="text-slate-650">VARCHAR</span></p>
                <p className="flex justify-between"><span>tags</span> <span className="text-indigo-400">VARCHAR[]</span></p>
                <p className="flex justify-between"><span>embedding</span> <span className="text-indigo-400">FLOAT[]</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-indigo-950/15 border border-indigo-900/30 rounded-xl space-y-2 text-xs">
          <p className="text-[10.5px] text-indigo-300 font-bold font-mono">⚡ Vector cosine_similarity search:</p>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            The SQL Sandbox executes embedding comparisons using 16-D normalized vector arrays in local engines. Select Template #4 on the right to examine active vector indexes in action.
          </p>
        </div>
      </div>

      {/* Right Column: SQL Command Prompter & Spreadsheet Result Panel */}
      <div className="lg:col-span-8 bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col space-y-4">
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-200 flex items-center space-x-2 uppercase font-display tracking-wide">
            <span>Client SQL Sandbox</span>
          </h4>
          <p className="text-[11px] text-slate-405 leading-relaxed font-sans">
            Write standard SQL SELECT statements to query, search, group, or calculate vector distances over saved Spec files.
          </p>
        </div>

        {/* SQL Fast Template pill buttons */}
        <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]" id="sql-templates">
          <button 
            onClick={() => setSqlQuery("SHOW TABLES;")}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer text-[10px]"
          >
            1. show tables;
          </button>
          <button 
            onClick={() => setSqlQuery("SELECT title, promptScore, caliberStatus FROM prompts WHERE promptScore >= 90;")}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer text-[10px]"
          >
            2. filter exceptional prompts;
          </button>
          <button 
            onClick={() => setSqlQuery("SELECT title, tags FROM prompts WHERE tags LIKE '%Auth%';")}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 cursor-pointer text-[10px]"
          >
            3. search tags;
          </button>
          <button 
            onClick={() => {
              const vec = Array.from({length: 16}, () => Number((Math.random() * 2 - 1).toFixed(2)));
              setSqlQuery(`SELECT title, promptScore, array_cosine_similarity(embedding, [${vec.join(",")}]) as similarity_index FROM prompts ORDER BY similarity_index DESC LIMIT 2;`);
            }}
            className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-emerald-400 cursor-pointer text-[10px]"
          >
            4. cosine vector search;
          </button>
        </div>

        {/* Editor interface */}
        <div className="space-y-2">
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={4}
            className="w-full bg-[#04060b] border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-indigo-300 leading-relaxed focus:outline-none focus:border-indigo-500 transition-all font-medium"
            placeholder="SELECT * FROM prompts;"
            id="motherduck-sql-textarea"
          />
          <div className="flex justify-between items-center bg-slate-950">
            <p className="text-[10px] text-slate-500 font-mono">
              * The table prompts contains complete records Synced to Google Drive.
            </p>
            <button
              onClick={() => executeSqlQuery()}
              disabled={sqlLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-505 disabled:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow hover:shadow-indigo-500/20"
              id="motherduck-run-sql-btn"
            >
              {sqlLoading ? "Querying..." : "Run SQL Statement"}
            </button>
          </div>
        </div>

        {/* SQL Results panel */}
        <div className="flex-1 min-h-[160px] max-h-[360px] overflow-auto border border-slate-850 rounded-xl bg-[#04060b] p-3" id="sql-results">
          {sqlLoading ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-xs text-center space-y-2 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-400 mx-auto animate-reverse" />
              <span>Executing query statement on your local catalog...</span>
            </div>
          ) : sqlError ? (
            <div className="p-4 bg-red-955/20 border border-red-900/40 text-red-400 text-xs rounded-lg font-mono flex items-start space-x-2 whitespace-pre-wrap">
              <span className="font-bold">❌ SQL EXECUTION ERROR:</span>
              <span>{sqlError}</span>
            </div>
          ) : sqlResult ? (
            <div className="space-y-2 font-mono text-xs">
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider pl-1">
                ✓ Query Executed Successfully ({sqlResult.rows.length} rows returned):
              </p>
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    {sqlResult.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 border-r border-slate-800 last:border-r-0">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sqlResult.rows.length === 0 ? (
                    <tr>
                      <td colSpan={sqlResult.columns.length} className="p-4 text-center text-slate-600 italic">
                        Empty result set returned.
                      </td>
                    </tr>
                  ) : (
                    sqlResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-900/60 hover:bg-slate-900/30 text-slate-300">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 border-r border-slate-900 last:border-r-0 max-w-[200px] truncate" title={String(cell)}>
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-slate-600 text-xs text-center space-y-1">
              <Database className="w-8 h-8 text-slate-700 mx-auto mb-1" />
              <span>No active queries in pipeline. Select a template script or write your own statement.</span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
