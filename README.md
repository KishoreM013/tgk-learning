# TGK Learning

TGK Learning is a browser-based data structures lab. Each structure has an interactive playground that lets you change the local state, inspect the visual result, and read related pseudocode and complexity notes.

## Requirements

- Node.js 18 or newer
- npm, or pnpm if you already use it

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

The project also includes a `pnpm-lock.yaml`, so pnpm can be used instead:

```bash
pnpm install
pnpm dev
```

## Commands

```bash
npm run dev        # Start the Vite development server
npm run typecheck  # Run TypeScript without emitting files
npm run build      # Create the production bundle
npm run serve      # Preview the production bundle
```

## Deployment

The repository includes configuration for both Vercel and Netlify. Both platforms use `npm run build`, publish `dist/public`, and rewrite client-side routes to `index.html`.

### Vercel

Import the repository into Vercel and deploy with the detected Vite settings. The committed `vercel.json` contains the build output and SPA rewrite.

### Netlify

Import the repository into Netlify and deploy. The committed `netlify.toml` contains the build command, publish directory, Node version, and SPA redirect.

## Available Routes

- `/` - Catalog and searchable workbench
- `/about` - About the learning lab
- `/:group/:slug` - Interactive structure playground

Supported groups are:

- `/linear/*`
- `/nonlinear/*`
- `/hashing/*`
- `/concurrency/*`
- `/specialized/*`

## Data Structures

### Linear

Array, Dynamic Array, Singly Linked List, Doubly Linked List, Circular Linked List, Stack, Queue, Circular Queue, Deque, and Priority Queue.

### Non-Linear

Binary Tree, Binary Search Tree, AVL Tree, Red-Black Tree, B-Tree, B+ Tree, Trie, Segment Tree, Fenwick Tree, Suffix Tree, N-ary Tree, and Quadtree.

### Non-Linear: Graph

Directed Graph, Undirected Graph, Weighted Graph, Unweighted Graph, and Flow Networks.

Graph algorithms are exposed as operations inside the relevant graph playgrounds. They are not separate catalog structures. Examples include BFS, DFS, Dijkstra, minimum spanning tree operations, topological ordering, and flow operations.

### Hashing and Maps/Sets

Hash Table, HashMap, TreeMap, ConcurrentHashMap, HashSet, TreeSet, Multiset, BitSet, Dictionary, and Multimap.

### Concurrency and Parallel

ConcurrentSkipListMap, ConcurrentSkipListSet, and CopyOnWriteArrayList.

### Specialized and Advanced

Binary Heap, Fibonacci Heap, Disjoint Set / Union-Find, Bloom Filter, Skip List, and LRU Cache.

## Using a Playground

1. Choose an operation from the operation selector.
2. Enter only the fields required for that operation. For example, `Pop`, `Peek`, `Traverse`, and `Reset` do not show an input field.
3. Press the operation button to update the visualization.
4. Use the canvas controls to zoom, reset the view, pan, or enter fullscreen mode.
5. Use the step history controls to review recent status messages.

All playground state is local to the browser session. The app does not require an account or backend service.

## Project Structure

- `src/App.tsx` - Route definitions, catalog metadata, shared pages, and layout
- `src/components/playgrounds/` - Interactive playgrounds grouped by category
- `src/components/playgrounds/PlaygroundFrame.tsx` - Shared playground controls and canvas behavior
- `src/components/ui/` - Reusable UI components
- `src/index.css` - Application styling and responsive layout
- `src/main.tsx` - React entry point and error boundary setup
- `public/` - Static public assets

## Technology

- React 19
- TypeScript
- Vite
- Wouter
- TanStack React Query
- Tailwind CSS and custom CSS
- Radix UI components
- Lucide icons
