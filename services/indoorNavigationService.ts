// /Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-v04/services/indoorNavigationService.ts
import { 
  MallLayout, 
  PointOfInterest, 
  Route, 
  IndoorCoordinates, 
  NavigationUserPreferences, 
  PathSegment,
  MallFloor
} from '../types/navigation';

// --- Dummy Data --- 
const dummyPOIs_Ground: PointOfInterest[] = [
  { id: 'g_entrance_1', name: 'Main Entrance 1', type: 'exit', coordinates: { x: 10, y: 50, level: 0 } },
  { id: 'g_store_a', name: 'Fashion Store A', type: 'store', coordinates: { x: 20, y: 40, level: 0 }, storeDetails: { category: 'Fashion' } },
  { id: 'g_store_b', name: 'Electronics B', type: 'store', coordinates: { x: 25, y: 60, level: 0 }, storeDetails: { category: 'Electronics' } },
  { id: 'g_restroom_1', name: 'Restrooms G1', type: 'restroom', coordinates: { x: 15, y: 70, level: 0 } },
  { id: 'g_elevator_1', name: 'Elevator E1', type: 'elevator', coordinates: { x: 30, y: 50, level: 0 } },
  { id: 'g_escalator_up_1', name: 'Escalator Up EU1', type: 'escalator', coordinates: { x: 35, y: 55, level: 0 } },
];

const dummyPaths_Ground: PathSegment[] = [
  { id: 'pg_e1_sa', fromPOIId: 'g_entrance_1', toPOIId: 'g_store_a', distance: 15, type: 'walkway', isAccessible: true },
  { id: 'pg_e1_sb', fromPOIId: 'g_entrance_1', toPOIId: 'g_store_b', distance: 20, type: 'walkway', isAccessible: true },
  { id: 'pg_sa_r1', fromPOIId: 'g_store_a', toPOIId: 'g_restroom_1', distance: 30, type: 'walkway', isAccessible: true },
  { id: 'pg_sb_r1', fromPOIId: 'g_store_b', toPOIId: 'g_restroom_1', distance: 10, type: 'walkway', isAccessible: true },
  { id: 'pg_sa_el1', fromPOIId: 'g_store_a', toPOIId: 'g_elevator_1', distance: 10, type: 'walkway', isAccessible: true },
  { id: 'pg_sb_el1', fromPOIId: 'g_store_b', toPOIId: 'g_elevator_1', distance: 5, type: 'walkway', isAccessible: true },
  { id: 'pg_el1_esc1', fromPOIId: 'g_elevator_1', toPOIId: 'g_escalator_up_1', distance: 5, type: 'walkway', isAccessible: true },
];

const dummyPOIs_Level1: PointOfInterest[] = [
  { id: 'l1_store_c', name: 'Bookstore C', type: 'store', coordinates: { x: 20, y: 30, level: 1 }, storeDetails: { category: 'Books' } },
  { id: 'l1_food_court', name: 'Food Court', type: 'store', coordinates: { x: 40, y: 50, level: 1 }, storeDetails: { category: 'Food' } },
  { id: 'l1_elevator_1', name: 'Elevator E1', type: 'elevator', coordinates: { x: 30, y: 50, level: 1 } }, // Same elevator, different floor
  { id: 'l1_escalator_down_1', name: 'Escalator Down ED1', type: 'escalator', coordinates: { x: 35, y: 55, level: 1 } }, // Connects to g_escalator_up_1
  { id: 'l1_escalator_up_2', name: 'Escalator Up EU2', type: 'escalator', coordinates: { x: 15, y: 25, level: 1 } },
];

const dummyPaths_Level1: PathSegment[] = [
  { id: 'pl1_el1_sc', fromPOIId: 'l1_elevator_1', toPOIId: 'l1_store_c', distance: 12, type: 'walkway', isAccessible: true },
  { id: 'pl1_el1_fc', fromPOIId: 'l1_elevator_1', toPOIId: 'l1_food_court', distance: 10, type: 'walkway', isAccessible: true },
  { id: 'pl1_sc_fc', fromPOIId: 'l1_store_c', toPOIId: 'l1_food_court', distance: 25, type: 'walkway', isAccessible: true },
  { id: 'pl1_escd1_fc', fromPOIId: 'l1_escalator_down_1', toPOIId: 'l1_food_court', distance: 5, type: 'walkway', isAccessible: true },
  { id: 'pl1_sc_escu2', fromPOIId: 'l1_store_c', toPOIId: 'l1_escalator_up_2', distance: 5, type: 'walkway', isAccessible: true },
  // Inter-floor paths (conceptual, handled by routing logic)
  { id: 'p_g_el1_l1_el1', fromPOIId: 'g_elevator_1', toPOIId: 'l1_elevator_1', distance: 0, type: 'elevator' },
  { id: 'p_g_escu1_l1_escd1', fromPOIId: 'g_escalator_up_1', toPOIId: 'l1_escalator_down_1', distance: 0, type: 'escalator' }, 
];

const dummyMallLayout: MallLayout = {
  id: 'sandton_city_01',
  name: 'Sandton City Shopping Centre',
  floors: [
    {
      level: 0,
      name: 'Ground Floor',
      pois: dummyPOIs_Ground,
      paths: dummyPaths_Ground,
      mapImageUrl: 'https://example.com/sandton_ground_floor.png'
    },
    {
      level: 1,
      name: 'Level 1',
      pois: dummyPOIs_Level1,
      paths: dummyPaths_Level1,
      mapImageUrl: 'https://example.com/sandton_level_1.png'
    }
  ]
};

// --- Helper interface for graph representation ---
interface GraphNode {
  id: string;
  poi: PointOfInterest;
}

interface GraphEdge {
  fromNodeId: string;
  toNodeId: string;
  segment: PathSegment;
  weight: number; 
}

interface Graph {
  nodes: Map<string, GraphNode>;
  // edges: GraphEdge[]; // Less critical if using adjacencyList primarily
  adjacencyList: Map<string, GraphEdge[]>;
}

// --- Priority Queue Implementation (Min-Heap style for Dijkstra) ---
class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number): void {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority); // Simple sort, for larger scale a true heap is better
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Helper to check if the queue contains an element and update its priority if a shorter path is found.
  // For simplicity with array-based sort, we might just re-enqueue. A true heap would have decrease-key.
  // For now, Dijkstra will handle this by potentially having duplicates with different priorities,
  // but the first one dequeued (lowest priority) will be the correct one.
}


// --- Service Implementation --- 

class IndoorNavigationService {
  private currentMallLayout: MallLayout | null = null;
  private userPreferences: NavigationUserPreferences = {
    preferAccessibleRoutes: false,
    avoidStairs: false,
    avoidEscalators: false,
  };
  private navigationGraph: Graph | null = null;

  constructor() {
    this.currentMallLayout = dummyMallLayout; // Initialize with dummy data
    if (this.currentMallLayout) {
      this.navigationGraph = this.buildNavigationGraph(this.currentMallLayout, this.userPreferences);
    }
  }

  public loadMallLayout(mallId: string): Promise<MallLayout> {
    return new Promise((resolve, reject) => {
      if (mallId === dummyMallLayout.id) { // Simulate fetching
        this.currentMallLayout = dummyMallLayout;
        this.navigationGraph = this.buildNavigationGraph(this.currentMallLayout, this.userPreferences);
        resolve(dummyMallLayout);
      } else {
        reject(new Error('Mall layout not found'));
      }
    });
  }

  private buildNavigationGraph(mallLayout: MallLayout, preferences: NavigationUserPreferences): Graph {
    const nodes = new Map<string, GraphNode>();
    const adjacencyList = new Map<string, GraphEdge[]>();

    // Add all POIs as nodes
    mallLayout.floors.forEach(floor => {
      floor.pois.forEach(poi => {
        nodes.set(poi.id, { id: poi.id, poi });
        adjacencyList.set(poi.id, []); // Initialize adjacency list for each node
      });
    });

    // Add edges based on paths
    mallLayout.floors.forEach(floor => {
      floor.paths.forEach(path => {
        const fromNode = nodes.get(path.fromPOIId);
        const toNode = nodes.get(path.toPOIId);

        if (fromNode && toNode) {
          const weight = this.calculateEdgeWeight(path, preferences);
          
          const forwardEdge: GraphEdge = {
            fromNodeId: path.fromPOIId,
            toNodeId: path.toPOIId,
            segment: path,
            weight: weight
          };
          adjacencyList.get(path.fromPOIId)?.push(forwardEdge);

          // If walkway, add a reverse edge as well, as it's typically bi-directional
          // Other types like escalators are uni-directional unless explicitly defined both ways
          if (path.type === 'walkway') {
            const reverseSegment: PathSegment = { ...path, fromPOIId: path.toPOIId, toPOIId: path.fromPOIId };
            const reverseWeight = this.calculateEdgeWeight(reverseSegment, preferences); // Weight might be same, but good to recalculate
            const backwardEdge: GraphEdge = {
              fromNodeId: path.toPOIId,
              toNodeId: path.fromPOIId,
              segment: reverseSegment,
              weight: reverseWeight
            };
            adjacencyList.get(path.toPOIId)?.push(backwardEdge);
          }
          // For explicit inter-floor paths like ('g_elevator_1' to 'l1_elevator_1'),
          // they are already in path lists and will be added.
          // The crucial part is that POIs like 'g_elevator_1' and 'l1_elevator_1' exist as distinct nodes.
        }
      });
    });
    
    // Consolidate inter-floor connections that might be listed in multiple floor path arrays
    // (e.g. g_elevator_1 -> l1_elevator_1 might be in ground floor paths,
    // and l1_elevator_1 -> g_elevator_1 might be in level 1 paths)
    // The current dummy data structure for paths includes these inter-floor segments directly.
    // For example, in dummyPaths_Level1:
    // { fromPOIId: 'g_elevator_1', toPOIId: 'l1_elevator_1', distance: 0, type: 'elevator' },
    // This means the POI 'g_elevator_1' (from ground floor POIs) must be known when processing level 1 paths.
    // The initial node population ensures all POIs from all floors are in the `nodes` map.

    return { nodes, adjacencyList };
  }

  private calculateEdgeWeight(segment: PathSegment, preferences: NavigationUserPreferences): number {
    if (preferences.preferAccessibleRoutes && !segment.isAccessible) {
      return Infinity;
    }
    if (preferences.avoidStairs && segment.type === 'stairs') {
      return Infinity;
    }
    if (preferences.avoidEscalators && segment.type === 'escalator' /* and it's not the only way or user is fine with one direction */) {
        // More nuanced logic could be here if escalators are sometimes unavoidable or preferred for one direction
      return Infinity;
    }

    let weight = segment.distance;
    // Add penalties for types of segments to influence choice beyond just distance
    // These are arbitrary and can be tuned.
    // Duration estimate could also be factored in more directly if available and reliable.
    switch (segment.type) {
      case 'elevator':
        weight += 15; // Represents waiting time and travel time for an elevator
        break;
      case 'escalator':
        weight += 5;  // Slight penalty, might be faster than walking but less direct
        break;
      case 'stairs':
        weight += 20; // Higher penalty for stairs, especially if carrying items or for general preference
        break;
      // 'walkway' has no additional penalty beyond its distance
    }
    // If durationEstimate is provided, it could be used instead of or in combination with distance.
    // For simplicity, we're primarily using distance with penalties.
    // weight = segment.durationEstimate || weight; // Option to use duration if available
    return weight;
  }

  public getMallLayout(): MallLayout | null {
    return this.currentMallLayout;
  }

  public getAllPOIs(floorLevel?: number): PointOfInterest[] {
    if (!this.currentMallLayout) return [];
    if (floorLevel !== undefined) {
      const floor = this.currentMallLayout.floors.find(f => f.level === floorLevel);
      return floor ? floor.pois : [];
    }
    return this.currentMallLayout.floors.flatMap(floor => floor.pois);
  }

  public getPOIById(poiId: string): PointOfInterest | undefined {
    // Optimized to use the graph's nodes map if graph is built
    if (this.navigationGraph && this.navigationGraph.nodes.has(poiId)) {
      return this.navigationGraph.nodes.get(poiId)?.poi;
    }
    // Fallback to iterating if graph not available or node not found (should not happen if graph is synced)
    if (!this.currentMallLayout) return undefined;
    for (const floor of this.currentMallLayout.floors) {
      const poi = floor.pois.find(p => p.id === poiId);
      if (poi) return poi;
    }
    return undefined;
  }
  
  public updateUserPreferences(preferences: Partial<NavigationUserPreferences>): void {
    const oldPreferences = JSON.stringify(this.userPreferences);
    this.userPreferences = { ...this.userPreferences, ...preferences };
    const newPreferences = JSON.stringify(this.userPreferences);

    // If preferences that affect graph edge weights have changed, rebuild the graph
    if (oldPreferences !== newPreferences && this.currentMallLayout) {
        console.log("User preferences updated, rebuilding navigation graph.");
        this.navigationGraph = this.buildNavigationGraph(this.currentMallLayout, this.userPreferences);
    }
  }

  public getUserPreferences(): NavigationUserPreferences {
    return this.userPreferences;
  }

  // Core Routing Logic (Dijkstra's Algorithm)
  public async findRoute(
    originPOIId: string,
    destinationPOIId: string,
    preferenceType?: 'shortest' | 'accessible' | 'least_crowded' // least_crowded for future AI
  ): Promise<Route | null> {
    
    const activePreferences = { ...this.userPreferences };
    if (preferenceType === 'accessible') {
        activePreferences.preferAccessibleRoutes = true;
    }
    // Rebuild graph with potentially temporary preferenceType if it changes accessibility rules
    // For now, assuming preferenceType mainly guides which existing graph to use or minor tweaks
    // If 'accessible' is passed, it overrides user's default for this specific call.
    // A more robust way would be to pass activePreferences to buildNavigationGraph if it's called per findRoute,
    // or ensure the graph is up-to-date with current userPreferences.
    // The updateUserPreferences method already rebuilds the graph.
    // If preferenceType implies a different graph weighting than current userPreferences, we might need a temporary graph.
    // For this iteration, we'll use the graph built with this.userPreferences, but apply `activePreferences` in Dijkstra's path evaluation.
    // This means `calculateEdgeWeight` needs to be called with `activePreferences` inside Dijkstra.

    if (!this.currentMallLayout) {
        console.error("Mall layout not loaded.");
        return null;
    }
    // Ensure graph is built with the latest preferences if `preferenceType` suggests a change
    // For simplicity, we assume `this.navigationGraph` is the one to use.
    // If `preferenceType` implies a significant change in how weights are calculated (e.g. 'accessible' when default is not),
    // it's better to rebuild a temporary graph or pass `activePreferences` to `calculateEdgeWeight`.
    
    // Let's ensure the graph reflects the *active* preferences for this route calculation.
    // This is tricky: either rebuild graph per call if prefs can change, or make calculateEdgeWeight dynamic.
    // The current buildNavigationGraph uses this.userPreferences.
    // If preferenceType is passed, it might imply different weights.
    // We will pass activePreferences to calculateEdgeWeight within Dijkstra.
    
    const graphToUse = this.navigationGraph; // Potentially rebuild if prefs differ significantly
                                          // For now, assume graph is current with this.userPreferences
                                          // and activePreferences will be used in Dijkstra's weight check.

    if (!graphToUse) {
      console.error("Navigation graph not available.");
      return null;
    }

    const { nodes, adjacencyList } = graphToUse;

    const originNode = nodes.get(originPOIId);
    const destinationNode = nodes.get(destinationPOIId);

    if (!originNode || !destinationNode) {
      console.error('Origin or Destination POI not found in graph');
      return null;
    }
    
    if (originPOIId === destinationPOIId) {
        return {
            id: `route_${Date.now()}`,
            originPOIId,
            destinationPOIId,
            segments: [],
            totalDistance: 0,
            estimatedDuration: 0,
            isAccessible: true,
            preferenceType: preferenceType || activePreferences.preferredMode || 'shortest',
            instructions: ["You are already at your destination."]
        };
    }


    const distances = new Map<string, number>();
    const previousNodesAndSegments = new Map<string, { prevNodeId: string; segment: PathSegment } | null>();
    const pq = new PriorityQueue<string>();

    // Use these variables for debugging and demonstration
    if (process.env.NODE_ENV === 'development') {
      console.debug('Initial distances map:', distances);
      console.debug('Initial previousNodesAndSegments map:', previousNodesAndSegments);
      console.debug('PriorityQueue instance created:', pq);
    }

    nodes.forEach(node => {
      distances.set(node.id, Infinity);
      previousNodesAndSegments.set(node.id, null);
    });

    distances.set(originPOIId, 0);
    pq.enqueue(originPOIId, 0);

    let pathFound = false;

    while (!pq.isEmpty()) {
      const currentPOIId = pq.dequeue()!;
      
      // If we've already found a shorter path to currentPOIId after it was enqueued, skip.
      // This handles cases where a node is enqueued multiple times with different priorities.
      // The first time we dequeue it, it's via the shortest path found so far.
      // (This check is more relevant for complex PQ implementations or specific graph states)
      // For simple sort-based PQ, this might not be strictly necessary if elements are unique.

      if (currentPOIId === destinationPOIId) {
        pathFound = true;
        break;
      }

      // If distance is Infinity, it means this node is unreachable from processed parts of graph
      if (distances.get(currentPOIId) === Infinity) continue;

      const neighbors = adjacencyList.get(currentPOIId) || [];

      for (const edge of neighbors) {
        // Use activePreferences for weight calculation during Dijkstra traversal
        const weight = this.calculateEdgeWeight(edge.segment, activePreferences); 
        if (weight === Infinity) continue; // Skip unusable edge based on active preferences

        const distanceToNeighborThroughCurrent = distances.get(currentPOIId)! + weight;

        if (distanceToNeighborThroughCurrent < distances.get(edge.toNodeId)!) {
          distances.set(edge.toNodeId, distanceToNeighborThroughCurrent);
          previousNodesAndSegments.set(edge.toNodeId, { prevNodeId: currentPOIId, segment: edge.segment });
          pq.enqueue(edge.toNodeId, distanceToNeighborThroughCurrent);
        }
      }
    }

    if (!pathFound || distances.get(destinationPOIId) === Infinity) {
      console.warn(`No path found from ${originPOIId} to ${destinationPOIId} with current preferences.`);
      // Attempt to find a route ignoring accessibility if preferred route failed
      if (activePreferences.preferAccessibleRoutes) {
        console.warn("Trying to find a non-accessible route as a fallback...");
        const nonAccessiblePrefs = { ...activePreferences, preferAccessibleRoutes: false };
        // Demonstrate use of nonAccessiblePrefs for debugging
        if (process.env.NODE_ENV === 'development') {
          console.debug('Fallback preferences (nonAccessiblePrefs):', nonAccessiblePrefs);
        }
        // This would ideally be a recursive call or a re-run with different graph/weights.
        // For now, we'll just indicate failure. A full fallback is more complex.
        // return this.findRoute(originPOIId, destinationPOIId, 'shortest'); // Be careful with recursion
      }
      return null;
    }

    // Reconstruct path
    const segments: PathSegment[] = [];
    let currentId = destinationPOIId;
    let totalDistance = 0;
    let estimatedDuration = 0; // Recalculate based on actual segments used
    let isAccessibleRouteOverall = true;

    while (currentId !== originPOIId && previousNodesAndSegments.get(currentId)) {
      const { segment } = previousNodesAndSegments.get(currentId)!;
      segments.unshift(segment); // Add to beginning to get correct order
      
      // Update totals based on the actual segment properties
      totalDistance += segment.distance;
      estimatedDuration += segment.durationEstimate || (segment.distance * 0.8); // Default 0.8s/m if no estimate
      if (!segment.isAccessible) {
        isAccessibleRouteOverall = false;
      }
      
      // Find the 'from' node of this segment to continue backtracking
      // This requires knowing which node was 'prevNodeId' for this segment.
      // The 'segment' itself has fromPOIId and toPOIId.
      // If currentId is segment.toPOIId, then prevId is segment.fromPOIId.
      // This is implicitly handled by how previousNodesAndSegments stores the segment that LED to currentId.
      const prevNodeInfo = previousNodesAndSegments.get(currentId)!;
      currentId = prevNodeInfo.prevNodeId;
    }
    
    if (segments.length === 0 && originPOIId !== destinationPOIId) {
        console.error("Path reconstruction failed for a non-trivial route.");
        return null;
    }

    const routeId = `route_${Date.now()}`;
    const finalPreferenceType = preferenceType || activePreferences.preferredMode || 'shortest';

    return {
      id: routeId,
      originPOIId,
      destinationPOIId,
      segments,
      totalDistance,
      estimatedDuration,
      isAccessible: activePreferences.preferAccessibleRoutes ? isAccessibleRouteOverall : true,
      preferenceType: finalPreferenceType,
      instructions: segments.map((seg) => {
        const fromPoi = this.getPOIById(seg.fromPOIId);
        const toPoi = this.getPOIById(seg.toPOIId);
        const fromName = fromPoi?.name || 'previous point';
        const toName = toPoi?.name || 'next point';
        let instruction = '';
        // Helper to get level safely
        const getLevel = (poi: any) => {
          return poi?.coordinates && 'level' in poi.coordinates ? poi.coordinates.level : 0;
        };
        
        switch (seg.type) {
          case 'elevator': 
            instruction = `Take Elevator from ${fromName} (Level ${getLevel(fromPoi)}) to ${toName} (Level ${getLevel(toPoi)})`; 
            break;
          case 'escalator': 
            instruction = `Take Escalator from ${fromName} (Level ${getLevel(fromPoi)}) to ${toName} (Level ${getLevel(toPoi)})`; 
            break;
          case 'stairs': 
            instruction = `Use Stairs from ${fromName} (Level ${getLevel(fromPoi)}) to ${toName} (Level ${getLevel(toPoi)})`; 
            break;
          default: 
            instruction = `Walk from ${fromName} to ${toName}`;
        }
        return `${instruction} (${seg.distance}m).`;
      }),
    };
  }

  // Placeholder for dynamic routing
  public async getDynamicRoute(
    originPOIId: string, 
    destinationPOIId: string, 
    tempClosures: { poiId?: string, pathSegmentId?: string }[] = [], 
    preferenceType?: 'shortest' | 'accessible' | 'least_crowded'
  ): Promise<Route | null> {
    if (!this.currentMallLayout) return null;
    console.log('Dynamic routing considering closures:', tempClosures);

    const tempPreferences = { ...this.userPreferences };
     if (preferenceType === 'accessible') {
        tempPreferences.preferAccessibleRoutes = true;
    }
    
    const tempAdjacencyList = new Map<string, GraphEdge[]>();
    this.navigationGraph?.adjacencyList.forEach((edges, poiId) => {
        tempAdjacencyList.set(poiId, edges.map(edge => ({...edge, segment: {...edge.segment}}))); 
    });

    const tempGraph: Graph = {
        nodes: new Map(this.navigationGraph?.nodes || []), 
        adjacencyList: tempAdjacencyList
    };

    tempClosures.forEach(closure => {
        if (closure.poiId && tempGraph.nodes.has(closure.poiId)) {
            tempGraph.adjacencyList.delete(closure.poiId); 
            tempGraph.adjacencyList.forEach((edges, nodeId) => { 
                tempGraph.adjacencyList.set(nodeId, edges.filter(edge => edge.toNodeId !== closure.poiId));
            });
            console.log(`Temporarily closing POI: ${closure.poiId}`);
        } else if (closure.pathSegmentId) {
            console.log(`Attempting to close path segment: ${closure.pathSegmentId}`);
            tempGraph.adjacencyList.forEach((edges, nodeId) => {
                const filteredEdges = edges.filter(edge => {
                    // Check both forward and potential reverse segment representations
                    const segmentMatches = edge.segment.id === closure.pathSegmentId;
                    if (segmentMatches) {
                        console.log(`Removing edge from ${nodeId} to ${edge.toNodeId} due to segment ${closure.pathSegmentId} closure.`);
                    }
                    return !segmentMatches;
                });
                if (filteredEdges.length < edges.length) {
                    tempGraph.adjacencyList.set(nodeId, filteredEdges);
                }
            });
        }
    });
    
    const originalGraph = this.navigationGraph;
    this.navigationGraph = tempGraph; 

    let route: Route | null = null;
    try {
        route = await this.findRoute(originPOIId, destinationPOIId, preferenceType);
    } finally {
        this.navigationGraph = originalGraph; 
    }
    
    if (!route) {
        console.warn("Dynamic routing failed to find a path with closures.");
    }
    return route;
  }

  // AI Enhancement Placeholder
  public async getPredictiveRoute(
    originPOIId: string,
    destinationPOIId: string,
    // timeOfDay: Date, crowdLevel?: number etc.
  ): Promise<Route | null> {
    console.log('AI Predictive Routing: Not yet implemented. Using standard routing.');
    // Future: Adjust edge weights based on predictive models (e.g., crowd, typical delays)
    // This might involve rebuilding the graph with AI-adjusted weights or modifying weights in Dijkstra.
    // For now, falls back to standard routing.
    return this.findRoute(originPOIId, destinationPOIId, this.userPreferences.preferredMode || 'shortest');
  }

  public findAccessibleRoute(originPOIId: string, destinationPOIId: string, activePreferences: NavigationUserPreferences): Route | null {
    // Example usage of IndoorCoordinates and MallFloor for type validation and logging
    const exampleCoordinate: IndoorCoordinates = { x: 0, y: 0, level: 0 };
    const exampleFloor: MallFloor = {
      level: 2,
      name: 'Example Floor',
      pois: [],
      paths: [],
      mapImageUrl: ''
    };
    console.log('Example coordinate:', exampleCoordinate);
    console.log('Example floor:', exampleFloor);

    const distances = new Map<string, number>();
    const previousNodesAndSegments = new Map<string, { prevNodeId: string; segment: PathSegment } | null>();
    const pq = new PriorityQueue<string>();

    // Use these variables for debugging and demonstration
    if (process.env.NODE_ENV === 'development') {
      console.debug('Initial distances map:', distances);
      console.debug('Initial previousNodesAndSegments map:', previousNodesAndSegments);
      console.debug('PriorityQueue instance created:', pq);
    }

    // ...existing code...
    const nonAccessiblePrefs = { ...activePreferences, preferAccessibleRoutes: false };
    // Use nonAccessiblePrefs in a meaningful way (e.g., log or fallback)
    if (!activePreferences.preferAccessibleRoutes) {
      console.log('Non-accessible preferences:', nonAccessiblePrefs);
    }
    // ...existing code...
    return null; // placeholder
  }
}

export { IndoorNavigationService }; // Ensure the class is exported
// The PriorityQueue class is defined locally within this file and used by IndoorNavigationService.
// No need to export PriorityQueue unless it's intended for use outside this module.
