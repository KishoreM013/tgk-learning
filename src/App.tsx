import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';

type Group = 'linear' | 'nonlinear' | 'hashing' | 'concurrency' | 'specialized';
type Structure = {
  slug: string;
  title: string;
  group: Group;
  summary: string;
  realWorld: string;
  complexity: string;
  insight: string;
  tags: string[];
  operations: string[];
};

const make = (group: Group, title: string, summary: string, realWorld: string, complexity: string, insight: string, operations: string[] = ['Insert', 'Delete', 'Search']): Structure => ({
  group, title, slug: title.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), summary, realWorld, complexity, insight, operations,
  tags: group === 'linear' ? ['sequence', 'fundamentals'] : group === 'nonlinear' ? ['relationships', 'algorithms'] : group === 'hashing' ? ['lookup', 'keys'] : group === 'concurrency' ? ['parallel', 'safety'] : ['advanced', 'systems'],
});

const linear: Structure[] = [
  make('linear', 'Array', 'A fixed, indexable row of values where position is the superpower.', 'Image pixels, lookup tables, and contiguous sensor readings.', 'Access O(1) · Search O(n) · Insert O(n)', 'Contiguous memory makes reads fast, but shifting a middle value has a cost.', ['Insert', 'Delete', 'Search', 'Traverse']),
  make('linear', 'Dynamic Array', 'An array that grows by moving into a larger room when it fills up.', 'JavaScript arrays, playlists, and resizable buffers.', 'Access O(1) amortized · Append O(1) amortized', 'Capacity and size are separate ideas. Growth avoids a move on every append.', ['Append', 'Remove', 'Search']),
  make('linear', 'Singly Linked List', 'A chain of nodes: each node knows its value and who comes next.', 'Undo histories, lightweight queues, and memory allocators.', 'Access O(n) · Insert head O(1)', 'Links trade random access for cheap local edits.', ['Insert', 'Delete', 'Traverse']),
  make('linear', 'Doubly Linked List', 'A chain whose nodes can travel both forward and backward.', 'Browser history and LRU cache internals.', 'Insert/delete O(1) with node · Access O(n)', 'The previous link costs memory but makes removal and reverse travel direct.', ['Insert', 'Delete', 'Traverse']),
  make('linear', 'Circular Linked List', 'The tail points back to the head, so the route never truly ends.', 'Round-robin scheduling and turn-based systems.', 'Traverse O(n) · Insert O(1) at known node', 'There is no null end marker; stopping means recognizing the starting node.', ['Insert', 'Traverse', 'Reset']),
  make('linear', 'Stack', 'Last in, first out. A narrow tube where the newest item is always on top.', 'Call stacks, browser back buttons, and expression parsing.', 'Push O(1) · Pop O(1) · Peek O(1)', 'One access point is the constraint that makes reasoning predictable.', ['Push', 'Pop', 'Peek']),
  make('linear', 'Queue', 'First in, first out. Arrival order becomes the service order.', 'Print jobs, message brokers, and support ticket systems.', 'Enqueue O(1) · Dequeue O(1)', 'A head and tail pointer keep service fair without shifting the line.', ['Enqueue', 'Dequeue', 'Peek']),
  make('linear', 'Circular Queue', 'A queue that reuses empty slots by wrapping around the buffer.', 'Streaming buffers and device I/O.', 'Enqueue/dequeue O(1)', 'Modulo arithmetic turns the end of the buffer back into its beginning.', ['Enqueue', 'Dequeue', 'Wrap']),
  make('linear', 'Deque', 'A double-ended queue that lets both sides participate.', 'Sliding-window algorithms and task schedulers.', 'Push/pop both ends O(1)', 'Two ends, one sequence: useful when work can arrive or leave from either side.', ['Push front', 'Push back', 'Pop front', 'Pop back']),
  make('linear', 'Priority Queue', 'Items leave according to importance rather than arrival time.', 'CPU scheduling, route planning, and event simulation.', 'Peek O(1) · Insert O(log n)', 'A heap usually keeps the most urgent item close to the surface.', ['Insert', 'Extract', 'Peek']),
];
const nonlinear: Structure[] = [
  make('nonlinear', 'Binary Tree', 'A hierarchy where each node can branch to at most two children.', 'File systems, decision diagrams, and expression trees.', 'Traversal O(n)', 'Structure carries meaning: depth is a question about the path, not just the count.', ['Insert', 'Traverse', 'Reset']),
  make('nonlinear', 'Binary Search Tree', 'A binary tree with an ordering promise: left is smaller, right is larger.', 'Ordered indexes and in-memory sets.', 'Search average O(log n) · Worst O(n)', 'Balanced shape matters more than the rule itself.', ['Insert', 'Search', 'Traverse']),
  make('nonlinear', 'AVL Tree', 'A BST that rotates whenever a branch grows too lopsided.', 'Latency-sensitive ordered maps.', 'Search/insert/delete O(log n)', 'A small local rotation protects a global height guarantee.', ['Insert', 'Rotate', 'Search']),
  make('nonlinear', 'Red-Black Tree', 'A color-coded balanced tree with a softer, practical balance rule.', 'Standard library maps and sets.', 'Search/insert/delete O(log n)', 'Color constraints make rebalancing predictable without perfect symmetry.', ['Insert', 'Recolor', 'Search']),
  make('nonlinear', 'B-Tree', 'A wide, shallow search tree designed for blocks instead of individual cells.', 'Databases and file systems.', 'Search/insert O(log n)', 'Many keys per node reduce expensive disk trips.', ['Insert', 'Search', 'Split']),
  make('nonlinear', 'B+ Tree', 'A database tree whose records live in linked leaves for fast ranges.', 'Database indexes and storage engines.', 'Point/range search O(log n + k)', 'Separating index routing from leaf records makes scanning elegant.', ['Insert', 'Range scan', 'Search']),
  make('nonlinear', 'Trie', 'A tree that shares prefixes so words can be found by walking letters.', 'Autocomplete, spell check, and routing tables.', 'Search O(key length)', 'The alphabet, not the number of stored words, drives each lookup.', ['Insert', 'Search', 'Prefix']),
  make('nonlinear', 'Segment Tree', 'A tree that stores answers for ranges, not just individual values.', 'Live dashboards and interval queries.', 'Query/update O(log n)', 'Precomputation turns repeated range questions into small walks.', ['Build', 'Range query', 'Update']),
  make('nonlinear', 'Fenwick Tree', 'A compact indexed tree for prefix sums and point updates.', 'Frequency tables and inversion counting.', 'Query/update O(log n)', 'Binary low bits decide which partial sums belong to a prefix.', ['Update', 'Prefix sum', 'Reset']),
  make('nonlinear', 'Suffix Tree', 'A compressed index of every suffix in a string.', 'Genome search and plagiarism detection.', 'Build O(n) · Search O(m)', 'One structure turns substring questions into prefix walks.', ['Build', 'Search', 'Reset']),
  make('nonlinear', 'N-ary Tree', 'A hierarchy where a node can have many children.', 'Menus, org charts, and scene graphs.', 'Traversal O(n)', 'The branching factor changes shape, not the fundamental walk.', ['Insert', 'Traverse', 'Reset']),
  make('nonlinear', 'Quadtree', 'A 2D tree that keeps splitting space into four regions.', 'Maps, collision detection, and spatial search.', 'Query average O(log n)', 'Partitioning empty space keeps nearby things close to the question.', ['Insert point', 'Query region', 'Split']),
  make('nonlinear', 'Directed Graph', 'Nodes connected by arrows where direction carries meaning.', 'Dependencies, web links, and workflow states.', 'Traverse O(V + E)', 'An edge is a claim from one node to another, not a mutual friendship.', ['Add edge', 'DFS', 'BFS']),
  make('nonlinear', 'Undirected Graph', 'A network where every connection can be traveled both ways.', 'Social graphs, meshes, and network topology.', 'Traverse O(V + E)', 'Connectivity is about reachable components, not a root.', ['Add edge', 'DFS', 'BFS']),
  make('nonlinear', 'Weighted Graph', 'A graph whose edges carry a cost, distance, or preference.', 'Road networks and network routing.', 'Dijkstra O((V + E) log V)', 'The cheapest path is a sequence of local choices plus global bookkeeping.', ['Add edge', 'Dijkstra', 'Reset']),
  make('nonlinear', 'Unweighted Graph', 'A graph where every edge counts as one step.', 'Friend hops and minimum-transfer problems.', 'BFS shortest path O(V + E)', 'Breadth-first layers are distance when every edge costs the same.', ['Add edge', 'BFS', 'Reset']),
  make('nonlinear', 'DFS', 'Depth-first search follows one path until it cannot continue.', 'Maze solving, cycle detection, and compilers.', 'Time O(V + E)', 'A stack remembers the frontier while recursion makes the shape visible.', ['Start DFS', 'Step', 'Reset']),
  make('nonlinear', 'BFS', 'Breadth-first search expands a graph in tidy distance layers.', 'Shortest unweighted paths and crawlers.', 'Time O(V + E)', 'A queue turns the frontier into a reliable wave.', ['Start BFS', 'Step', 'Reset']),
  make('nonlinear', 'Dijkstra', 'A shortest-path algorithm for non-negative weighted edges.', 'GPS routing and packet networks.', 'O((V + E) log V)', 'The next closest unsettled node is safe to finalize.', ['Relax edge', 'Next node', 'Reset']),
  make('nonlinear', 'Kruskal', 'Build a minimum spanning tree by accepting the cheapest safe edges.', 'Network cable planning and clustering.', 'O(E log E)', 'Union-find prevents a tempting cheap edge from closing a cycle.', ['Sort edges', 'Accept edge', 'Reset']),
  make('nonlinear', 'Prim', 'Grow a minimum spanning tree outward from one chosen node.', 'Power grids and connected infrastructure.', 'O(E log V)', 'The boundary between the tree and the unknown is the key state.', ['Add edge', 'Grow tree', 'Reset']),
  make('nonlinear', 'Topological Sort', 'Order directed work so every prerequisite arrives first.', 'Build systems, course planning, and package managers.', 'O(V + E)', 'A valid order exists only when the dependency graph has no cycle.', ['Remove source', 'Next layer', 'Reset']),
  make('nonlinear', 'Flow Networks', 'Route limited quantities through a network of capacities.', 'Traffic, logistics, and matching problems.', 'Edmonds-Karp O(VE²)', 'The residual graph shows where capacity can still move.', ['Augment path', 'Cut edge', 'Reset']),
];
const hashing: Structure[] = [
  make('hashing', 'Hash Table', 'A key is mixed into a bucket index for near-constant lookup.', 'Caches, symbol tables, and indexes.', 'Average lookup O(1)', 'Collisions are not failure; they are the design problem to resolve.', ['Set key', 'Get key', 'Delete key']),
  make('hashing', 'HashMap', 'A general-purpose key-value table with no promised order.', 'Configuration, memoization, and object stores.', 'Average O(1)', 'Hash quality and load factor shape real performance.', ['Set key', 'Get key', 'Delete key']),
  make('hashing', 'TreeMap', 'A key-value map that keeps keys ordered by a tree.', 'Range queries and ordered reports.', 'Lookup O(log n)', 'Predictable ordering costs a little speed and buys useful ranges.', ['Set key', 'Get key', 'Range']),
  make('hashing', 'ConcurrentHashMap', 'A map designed for many threads reading and writing together.', 'Shared application caches and registries.', 'Average O(1)', 'Concurrency is a coordination problem layered on top of hashing.', ['Put key', 'Read key', 'Remove key']),
  make('hashing', 'HashSet', 'A collection of unique values backed by hashing.', 'Deduplication and membership checks.', 'Average add/has O(1)', 'Uniqueness falls out of asking the table one question: have we seen this?', ['Add', 'Has', 'Delete']),
  make('hashing', 'TreeSet', 'A sorted set where each value appears once.', 'Ordered unique labels and leaderboards.', 'O(log n)', 'Order and uniqueness can share one balanced tree.', ['Add', 'First', 'Delete']),
  make('hashing', 'Multiset', 'A set that remembers how many times each value appears.', 'Bag-of-words and inventory counts.', 'Average O(1)', 'Counting duplicates is often more useful than throwing them away.', ['Add count', 'Count', 'Reset']),
  make('hashing', 'BitSet', 'A dense row of bits for compact membership flags.', 'Permissions, sieves, and feature flags.', 'Set/test O(1)', 'One bit can carry a yes-or-no fact with almost no overhead.', ['Set bit', 'Test bit', 'Clear bit']),
  make('hashing', 'Dictionary', 'A readable name for a key-value lookup structure.', 'Language runtimes and application records.', 'Average O(1)', 'Names matter: a dictionary communicates intent before implementation.', ['Set key', 'Get key', 'Reset']),
  make('hashing', 'Multimap', 'A key points to many values rather than just one.', 'Tags, reverse indexes, and graph adjacency.', 'Average O(1) per key', 'A list at each bucket makes relationships natural to query.', ['Add value', 'Get values', 'Delete value']),
];
const concurrency: Structure[] = [
  make('concurrency', 'ConcurrentSkipListMap', 'A sorted map built from probabilistic linked-list layers.', 'Non-blocking ordered indexes.', 'Expected O(log n)', 'Multiple lanes let readers climb quickly without rotations.', ['Put key', 'Get key', 'Range']),
  make('concurrency', 'ConcurrentSkipListSet', 'A sorted unique collection safe for concurrent access.', 'Live rankings and shared coordination state.', 'Expected O(log n)', 'The same layered path can express a set when values are the keys.', ['Add', 'First', 'Delete']),
  make('concurrency', 'CopyOnWriteArrayList', 'A list that copies on writes so readers never see a half-change.', 'Listener registries and read-heavy configuration.', 'Read O(1) · Write O(n)', 'Pay on writes when stable, lock-free reads matter more.', ['Append', 'Snapshot', 'Reset']),
];
const specialized: Structure[] = [
  make('specialized', 'Binary Heap', 'A nearly complete tree that keeps the smallest or largest item at the top.', 'Priority queues and schedulers.', 'Peek O(1) · Insert O(log n)', 'Array indexes can impersonate tree edges without pointer overhead.', ['Insert', 'Extract', 'Peek']),
  make('specialized', 'Fibonacci Heap', 'A collection of flexible heap trees with famously cheap decrease-key.', 'Graph algorithms and research implementations.', 'Decrease-key O(1) amortized', 'Deferred consolidation moves work out of the hot path.', ['Insert', 'Decrease key', 'Extract']),
  make('specialized', 'Disjoint Set / Union-Find', 'A forest that answers whether two items share a component.', 'Kruskal, connectivity, and image labeling.', 'Nearly O(1) amortized', 'Path compression flattens history as you ask questions.', ['Find', 'Union', 'Reset']),
  make('specialized', 'Bloom Filter', 'A probabilistic membership test that never says yes by accident.', 'Caches, databases, and network edge filters.', 'O(k) per check', 'False positives are acceptable; false negatives are not.', ['Add', 'Check', 'Reset']),
  make('specialized', 'Skip List', 'A layered linked list that gets tree-like search without rotations.', 'Ordered indexes and concurrent collections.', 'Expected O(log n)', 'Random express lanes keep a simple node model surprisingly fast.', ['Insert', 'Search', 'Reset']),
  make('specialized', 'LRU Cache', 'A cache that evicts the item untouched for the longest time.', 'API clients, browsers, and image loading.', 'Get/set O(1)', 'A hash map finds entries; a doubly linked list remembers recency.', ['Get', 'Set', 'Evict']),
];
const allStructures = [...linear, ...nonlinear, ...hashing, ...concurrency, ...specialized];
const groupLabel: Record<Group, string> = { linear: 'Linear', nonlinear: 'Non-Linear', hashing: 'Hashing & Maps/Sets', concurrency: 'Concurrency & Parallel', specialized: 'Specialized / Advanced' };
const pathFor = (item: Structure) => `/${item.group}/${item.slug}`;

function Topbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return <header className="topbar">
    <div className="tgk-shell topbar-inner">
      <Link href="/" className="brand" data-testid="link-brand"><span className="brand-mark">TGK</span><span className="brand-name">TGK <span>Learning</span></span></Link>
      <nav className={open ? 'topnav mobile-open' : 'topnav'} aria-label="Main navigation">
        <Link href="/" aria-current={location === '/' ? 'page' : undefined} data-testid="link-catalog">Catalog</Link>
        <Link href="/about" aria-current={location === '/about' ? 'page' : undefined} data-testid="link-about">About the lab</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="nav-chip">browser lab / 01</span><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-menu">Menu</button></div>
    </div>
  </header>;
}

function Home() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Group>('all');
  const filtered = useMemo(() => allStructures.filter((item) => (filter === 'all' || item.group === filter) && `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const spotlight = (group: Group) => allStructures.filter((item) => item.group === group);
  return <><Topbar /><main>
    <section className="hero tgk-shell">
      <div className="hero-grid">
        <div><div className="eyebrow">A hands-on data structures lab</div><h1>Make the invisible<br /><em>click.</em></h1><p className="hero-copy">TGK Learning turns data structures into small, observable experiments. Change a node, watch the shape respond, and build the intuition that documentation leaves behind.</p><div className="hero-actions"><a href="#catalog" className="button-primary" data-testid="link-start-learning">Start exploring <span>→</span></a><Link href="/linear/array" className="button-quiet" data-testid="link-featured-array">Open Array lab</Link></div></div>
        <div className="hero-console" aria-label="Interactive structure preview"><div className="console-bar"><i className="console-dot" /><i className="console-dot" /><i className="console-dot" /><span className="console-label">array.play()</span></div><div className="console-stage"><div className="console-line"><span className="line-no">01</span><span className="console-pill">insert(2, 42)</span></div><div className="console-line"><span className="line-no">02</span><span className="console-node">7</span><span className="console-arrow">→</span><span className="console-node">42</span><span className="console-arrow">→</span><span className="console-node">18</span></div><div className="console-line"><span className="line-no">03</span><span className="console-note">The indexes after 2 shift right.<br />That is the trade-off you can see.</span></div></div></div>
      </div>
    </section>
    <section className="section tgk-shell">
      <div className="section-head"><div><div className="eyebrow">Choose your terrain</div><h2>Two ways to think.</h2></div><p>Start with the shape of the problem. The deeper catalog stays one click away when you are ready.</p></div>
      <div className="category-grid">
        <Link href="/linear/array" className="category-card primary-card" data-testid="card-category-linear"><span className="category-index">01 / LINEAR</span><h3>One line. Many rules.</h3><p>Arrays, lists, stacks, and queues. Learn how order, position, and access shape everyday algorithms.</p><div className="category-visual"><i /><i /><i /><i /></div><span className="category-arrow">↗</span></Link>
        <Link href="/nonlinear/binary-search-tree" className="category-card" data-testid="card-category-nonlinear"><span className="category-index">02 / NON-LINEAR</span><h3>Relationships get interesting.</h3><p>Trees and graphs reveal the paths hiding inside a problem — and the algorithms that navigate them.</p><div className="category-visual tree"><i /><i /><i /></div><span className="category-arrow">↗</span></Link>
      </div>
    </section>
    <section className="section tgk-shell" id="catalog">
      <div className="section-head"><div><div className="eyebrow">The full workbench</div><h2>Find a structure.</h2></div><p>Every card opens a focused playground with a visual state, pseudocode, and the reasoning behind the operation.</p></div>
      <div className="catalog-tools"><div className="search-wrap"><span>/</span><input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the workbench" aria-label="Search structures" data-testid="input-search-structures" /></div><div className="filter-tabs">{(['all', 'hashing', 'concurrency', 'specialized'] as const).map((tab) => <button key={tab} className={filter === tab ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter(tab)} data-testid={`button-filter-${tab}`}>{tab === 'all' ? 'More structures' : groupLabel[tab]}</button>)}</div></div>
      {filter === 'all' && !query ? <><CatalogRow title="Linear" items={spotlight('linear')} /><CatalogRow title="Non-Linear" items={spotlight('nonlinear')} /><div style={{ height: 35 }} /><CatalogRow title="More structures" items={[...hashing, ...concurrency, ...specialized]} /></> : <div className="structure-grid">{filtered.map((item) => <StructureCard key={item.slug} item={item} />)}{filtered.length === 0 && <div className="empty-state" style={{ gridColumn: '1/-1' }}>No structure matches that search. Try a shorter name.</div>}</div>}
    </section>
  </main><Footer /></>;
}

function CatalogRow({ title, items }: { title: string; items: Structure[] }) {
  return <div style={{ marginBottom: 30 }}><div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}><h3 style={{ margin: 0, font: '700 21px var(--app-font-serif)' }}>{title}</h3><span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>{items.length.toString().padStart(2, '0')} labs</span></div><div className="structure-grid">{items.map((item) => <StructureCard key={item.slug} item={item} />)}</div></div>;
}
function StructureCard({ item }: { item: Structure }) {
  return <Link href={pathFor(item)} className="structure-card" data-testid={`card-structure-${item.slug}`}><b>↗</b><strong>{item.title}</strong><small>{groupLabel[item.group]}</small></Link>;
}

function ArrayPlayground({ structure, onOperationChange }: { structure: Structure; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState(['12', '7', '24', '18']);
  const [input, setInput] = useState('42');
  const [index, setIndex] = useState('2');
  const [operation, setOperation] = useState('Insert');
  const [highlight, setHighlight] = useState<number | null>(null);
  const [message, setMessage] = useState('Ready for an experiment.');
  const act = () => {
    const i = Math.max(0, Math.min(values.length, Number(index) || 0));
    if (operation === 'Insert') { const next = [...values]; next.splice(i, 0, input || '0'); setValues(next); setMessage(`Inserted ${input || '0'} at index ${i}.`); }
    if (operation === 'Delete') { if (!values.length) return; const next = [...values]; const removed = next.splice(i >= values.length ? values.length - 1 : i, 1); setValues(next); setMessage(`Removed ${removed[0]} and shifted the rest.`); }
    if (operation === 'Search') { const found = values.indexOf(input); setHighlight(found < 0 ? null : found); setMessage(found < 0 ? `${input} is not in the array.` : `Found ${input} at index ${found}.`); }
    if (operation === 'Traverse') { setHighlight(null); setMessage(`Traversed ${values.length} cells from left to right.`); }
  };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} index={index} setIndex={setIndex} message={message}><div className="array-visual">{values.map((value, i) => <div className={highlight === i ? 'array-cell highlight' : 'array-cell'} key={`${value}-${i}`} data-testid={`cell-array-${i}`}>{value}<span className="array-index">[{i}]</span></div>)}</div></PlaygroundFrame>;
}

function StackPlayground({ structure, onOperationChange }: { structure: Structure; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState(['base', 'parse', 'render']); const [input, setInput] = useState('commit'); const [operation, setOperation] = useState('Push'); const [message, setMessage] = useState('Top is the only door in.');
  const act = () => { if (operation === 'Push') { setValues((v) => [...v, input || 'item']); setMessage(`Pushed ${input || 'item'} onto the top.`); } if (operation === 'Pop') { if (values.length) { setMessage(`Popped ${values[values.length - 1]} from the top.`); setValues((v) => v.slice(0, -1)); } } if (operation === 'Peek') setMessage(values.length ? `Peek sees ${values[values.length - 1]}.` : 'The stack is empty.'); };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}><div className="stack-visual">{values.map((value, i) => <div className="stack-cell" key={`${value}-${i}`}>{value}</div>)}</div></PlaygroundFrame>;
}

function QueuePlayground({ structure, onOperationChange }: { structure: Structure; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState(['Ada', 'Linus', 'Grace']); const [input, setInput] = useState('Katherine'); const [operation, setOperation] = useState('Enqueue'); const [message, setMessage] = useState('The oldest arrival leaves first.');
  const act = () => { if (operation === 'Enqueue') { setValues((v) => [...v, input || 'guest']); setMessage(`${input || 'guest'} joined at the tail.`); } if (operation === 'Dequeue') { if (values.length) { setMessage(`${values[0]} left from the head.`); setValues((v) => v.slice(1)); } } if (operation === 'Peek') setMessage(values.length ? `${values[0]} is next.` : 'The queue is empty.'); };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}><div className="queue-visual"><span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>HEAD</span>{values.map((value, i) => <span className="queue-cell" key={`${value}-${i}`}>{value}</span>)}<span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>TAIL</span></div></PlaygroundFrame>;
}

type TreeItem = { value: number; left?: TreeItem; right?: TreeItem };
function addTree(node: TreeItem | undefined, value: number): TreeItem { if (!node) return { value }; if (value < node.value) return { ...node, left: addTree(node.left, value) }; return { ...node, right: addTree(node.right, value) }; }
function TreeNode({ node }: { node?: TreeItem }) { if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>empty</span>; return <div className="tree-node"><span>{node.value}</span><div className="tree-children"><div className="tree-child"><TreeNode node={node.left} /></div><div className="tree-child"><TreeNode node={node.right} /></div></div></div>; }
function BSTPlayground({ structure, onOperationChange }: { structure: Structure; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState([42, 19, 64, 8, 27, 55, 71]); const [input, setInput] = useState('33'); const [operation, setOperation] = useState('Insert'); const [message, setMessage] = useState('Every left turn is smaller; every right turn is larger.'); const root = useMemo(() => values.reduce<TreeItem | undefined>((tree, value) => addTree(tree, value), undefined), [values]);
  const act = () => { const number = Number(input); if (!Number.isFinite(number)) return; if (operation === 'Insert') { if (values.includes(number)) setMessage(`${number} is already in the tree.`); else { setValues((v) => [...v, number]); setMessage(`Inserted ${number}; follow the comparisons.`); } } if (operation === 'Search') setMessage(values.includes(number) ? `${number} is found on the path.` : `${number} is not in this tree.`); if (operation === 'Traverse') setMessage(`In-order traversal: ${[...values].sort((a, b) => a - b).join(' → ')}.`); };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}><div className="tree-visual"><TreeNode node={root} /></div></PlaygroundFrame>;
}

function SharedPlayground({ structure, onOperationChange }: { structure: Structure; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState(['node A', 'node B', 'node C']); const [input, setInput] = useState('node D'); const [operation, setOperation] = useState(structure.operations[0]); const [message, setMessage] = useState('This visualizer keeps the core idea in view.');
  const act = () => { if (/insert|add|append|push|set|put/i.test(operation)) { setValues((v) => [...v, input || 'new value']); setMessage(`Applied ${operation.toLowerCase()} with ${input || 'new value'}.`); } else if (/delete|remove|extract|evict|clear/i.test(operation)) { setValues((v) => v.slice(0, -1)); setMessage(`Applied ${operation.toLowerCase()} to the latest item.`); } else setMessage(`${operation} inspected the current state.`); };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}><div className="shared-visual"><div className="shared-visual-mark"><span>{values.join('  ·  ') || 'empty structure'}</span></div><p>State changes stay local to this browser session so you can experiment freely.</p></div></PlaygroundFrame>;
}

function PlaygroundFrame({ title, operation, setOperation, onOperationChange, operations, onAction, input, setInput, index, setIndex, message, children }: { title: string; operation: string; setOperation: (v: string) => void; onOperationChange: (operation: string) => void; operations: string[]; onAction: () => void; input: string; setInput: (v: string) => void; index?: string; setIndex?: (v: string) => void; message: string; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const zoomBy = (amount: number) => setView((current) => ({ ...current, scale: Math.min(2.2, Math.max(0.5, Number((current.scale + amount).toFixed(2)))) }));
  const resetView = () => setView({ x: 0, y: 0, scale: 1 });
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await frameRef.current?.requestFullscreen?.();
      else if (document.fullscreenElement === frameRef.current) await document.exitFullscreen();
    } catch {
      // Browsers can reject fullscreen when the permission is unavailable.
    }
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const drag = dragRef.current;
    setView((current) => ({ ...current, x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY }));
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? -0.1 : 0.1);
  };
  const handleCanvasKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movements: Record<string, { x: number; y: number }> = { ArrowLeft: { x: 36, y: 0 }, ArrowRight: { x: -36, y: 0 }, ArrowUp: { x: 0, y: 36 }, ArrowDown: { x: 0, y: -36 } };
    const movement = movements[event.key];
    if (!movement) return;
    event.preventDefault();
    setView((current) => ({ ...current, x: current.x + movement.x, y: current.y + movement.y }));
  };

  return <div ref={frameRef} className="panel playground">
    <div className="panel-heading">
      <div><h2>Interactive playground</h2><small>LOCAL STATE / SAFE TO BREAK</small></div>
      <div className="playground-actions">
        <div className="view-controls" aria-label="Canvas zoom controls">
          <button className="view-button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out" data-testid="button-zoom-out">−</button>
          <button className="view-level" onClick={resetView} aria-label="Reset canvas view" data-testid="button-reset-view">{Math.round(view.scale * 100)}%</button>
          <button className="view-button" onClick={() => zoomBy(0.1)} aria-label="Zoom in" data-testid="button-zoom-in">+</button>
        </div>
        <button className="view-button view-reset" onClick={resetView} data-testid="button-reset-canvas">Reset view</button>
        <button className="view-button fullscreen-button" onClick={toggleFullscreen} data-testid="button-fullscreen">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
      </div>
    </div>
    <div className="lab-controls"><select className="field-select" style={{ width: 148 }} value={operation} onChange={(e) => { setOperation(e.target.value); onOperationChange(e.target.value); }} aria-label={`${title} operation`} data-testid={`select-operation-${title.toLowerCase().replaceAll(' ', '-')}`}>{operations.map((item) => <option key={item}>{item}</option>)}</select><input className="field-input" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Value" data-testid="input-playground-value" />{setIndex && index !== undefined && <input className="field-input" value={index} onChange={(e) => setIndex(e.target.value)} aria-label="Index" data-testid="input-playground-index" /> }<button className="button-primary" onClick={onAction} data-testid="button-run-operation">Run {operation}</button></div>
    <div className="visual-stage visual-viewport" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleWheel} onKeyDown={handleCanvasKeyDown} tabIndex={0} role="region" aria-label={`${title} infinite playground`} data-testid="playground-canvas">
      <div className="playground-plane" style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}>{children}</div>
      <div className="canvas-hint">Drag to pan · Scroll to zoom · Arrow keys to move</div>
    </div>
    <div className="lab-body"><div className="status-line" data-testid="status-playground">{message}</div></div>
  </div>;
}

function Pseudocode({ structure, operation }: { structure: Structure; operation: string }) {
  const code = operation.toLowerCase().includes('search') || operation.toLowerCase().includes('find') ? `function search(target):\n  current = root\n  while current exists:\n    if current.value == target:\n      return FOUND\n    current = next(current, target)\n  return NOT_FOUND` : operation.toLowerCase().includes('delete') || operation.toLowerCase().includes('remove') ? `function remove(target):\n  locate target and its neighbor\n  reconnect the two sides\n  release the old node\n  return updated structure` : operation.toLowerCase().includes('traverse') || operation.toLowerCase().includes('bfs') || operation.toLowerCase().includes('dfs') ? `function traverse(start):\n  frontier = [start]\n  while frontier is not empty:\n    current = take(frontier)\n    visit(current)\n    add unseen neighbors to frontier` : `function ${operation.toLowerCase().replaceAll(' ', '_')}(value):\n  choose the next position\n  preserve the structure's invariant\n  place value in the new position\n  return updated structure`;
  return <div className="panel pseudo-panel"><div className="panel-heading"><h2>Pseudocode</h2><small>{operation.toUpperCase()}</small></div><pre className="code-block" data-testid="text-pseudocode">{code}</pre><div style={{ padding: '0 20px 20px', color: 'hsl(var(--secondary) / .7)', font: '11px/1.6 var(--app-font-mono)' }}>// {structure.insight}</div></div>;
}

function StructurePage({ group }: { group: Group }) {
  const { slug } = useParams<{ slug?: string }>();
  const structure = allStructures.find((item) => item.group === group && item.slug === slug) ?? allStructures.find((item) => item.group === group);
  const [supportMessage, setSupportMessage] = useState('');
  const [activeOperation, setActiveOperation] = useState(structure?.operations[0] ?? 'Insert');
  if (!structure) return <NotFound />;
  const operationProps = { structure, onOperationChange: setActiveOperation };
  const playground = structure.slug === 'array' ? <ArrayPlayground {...operationProps} /> : structure.slug === 'stack' ? <StackPlayground {...operationProps} /> : structure.slug === 'queue' ? <QueuePlayground {...operationProps} /> : structure.slug === 'binary-search-tree' ? <BSTPlayground {...operationProps} /> : <SharedPlayground {...operationProps} />;
  return <><Topbar /><main className="tgk-shell"><section className="page-hero"><Link href="/" className="crumb" data-testid="link-back-catalog">← back to catalog</Link><h1>{structure.title}<span>.</span></h1><p>{structure.summary}</p><div className="tag-row">{structure.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></section><section className="learning-layout"><div>{playground}<div className="notes-grid"><div className="note-card"><div className="big-o">{structure.complexity.split(' · ')[0]}</div><h3>Complexity snapshot</h3><p>{structure.complexity}</p></div><div className="note-card"><h3>Where it shows up</h3><p>{structure.realWorld}</p></div><div className="note-card"><h3>Developer note</h3><p>{structure.insight}</p></div></div></div><Pseudocode structure={structure} operation={activeOperation} /></section><div className="support-callout"><div><h2>Keep the lab open.</h2><p>Enjoyed learning? Help us improve TGK Learning by donating.</p>{supportMessage && <div className="support-message">{supportMessage}</div>}</div><button className="button-quiet" onClick={() => setSupportMessage('A donation link will be available here in a future release.')} data-testid="button-future-donation">Future donation link</button></div></main><Footer /></>;
}

function About() {
  return <><Topbar /><main className="tgk-shell about-layout"><div className="eyebrow">A small learning lab</div><h1>Understand it<br />by touching it.</h1><p>TGK Learning is a presentation-first space for developers who want more than a definition. Each lab makes a data structure visible, gives you a safe control panel, and connects the shape to the trade-off it creates in real software.</p><p>There is no account, no progress dashboard, and no hidden service behind the curtain. Everything you do here runs in your browser.</p><div className="principles"><div className="principle"><strong>See the invariant</strong><span>Every playground makes the rule that keeps a structure useful easier to notice.</span></div><div className="principle"><strong>Change one thing</strong><span>Small operations reveal more than a static diagram ever can.</span></div><div className="principle"><strong>Take the idea with you</strong><span>Notes and pseudocode bridge the experiment to production code.</span></div></div><div style={{ marginTop: 42 }}><Link href="/" className="button-primary" data-testid="link-about-catalog">Browse the catalog →</Link></div></main><Footer /></>;
}

function Footer() { return <footer style={{ borderTop: '1px solid hsl(var(--border))', padding: '22px 0 28px' }}><div className="tgk-shell" style={{ display: 'flex', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap', color: 'hsl(var(--muted-foreground))', fontSize: 12 }}><span>© TGK Learning / made for curious builders</span><span style={{ fontFamily: 'var(--app-font-mono)' }}>no backend · no account · just practice</span></div></footer>; }
function NotFound() { return <><Topbar /><main className="tgk-shell not-found"><div><div className="eyebrow" style={{ justifyContent: 'center' }}>Lab signal lost</div><h1>404</h1><p>This experiment does not exist yet.</p><Link href="/" className="button-primary" data-testid="link-not-found-home">Return to the catalog</Link></div></main></>; }

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/about" component={About} /><Route path="/linear/:slug"><StructurePage group="linear" /></Route><Route path="/nonlinear/:slug"><StructurePage group="nonlinear" /></Route><Route path="/hashing/:slug"><StructurePage group="hashing" /></Route><Route path="/concurrency/:slug"><StructurePage group="concurrency" /></Route><Route path="/specialized/:slug"><StructurePage group="specialized" /></Route><Route component={NotFound} /></Switch>;
}
const queryClient = new QueryClient();
function App() { return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter></QueryClientProvider>; }
export default App;