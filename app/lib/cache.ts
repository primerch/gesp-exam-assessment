// GESP 试卷分析缓存层
// 使用内存缓存提高性能

// 缓存数据结构
export interface CachedAnalysis {
  questionHash: string;
  result: {
    isBeyond: boolean;
    confidence: number;
    reason: string;
    matchedLevel: number;
    matchedKeywords: string[];
  };
  timestamp: number;
  version: string;
}

// 当前缓存版本
const CACHE_VERSION = "v1.0";

// 内存缓存实现
class MemoryCache {
  private cache = new Map<string, CachedAnalysis>();
  private maxSize = 2000; // 最大缓存条目
  private accessOrder: string[] = []; // 用于 LRU

  get(key: string): CachedAnalysis["result"] | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查过期（30天）
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - item.timestamp > thirtyDays || item.version !== CACHE_VERSION) {
      this.cache.delete(key);
      this.removeFromOrder(key);
      return null;
    }

    // 更新访问顺序（LRU）
    this.updateAccessOrder(key);

    return item.result;
  }

  set(key: string, result: CachedAnalysis["result"]): void {
    // 如果已存在，更新
    if (this.cache.has(key)) {
      this.cache.set(key, {
        questionHash: key,
        result,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      });
      this.updateAccessOrder(key);
      return;
    }

    // LRU：如果满了，删除最久未访问的
    if (this.cache.size >= this.maxSize) {
      const oldest = this.accessOrder[0];
      if (oldest) {
        this.cache.delete(oldest);
        this.accessOrder.shift();
      }
    }

    this.cache.set(key, {
      questionHash: key,
      result,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    });
    this.accessOrder.push(key);
  }

  private removeFromOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private updateAccessOrder(key: string): void {
    this.removeFromOrder(key);
    this.accessOrder.push(key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }

  // 获取缓存命中率统计
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.cache.size / this.maxSize,
    };
  }
}

// 全局内存缓存实例
const memoryCache = new MemoryCache();

// 生成问题哈希
export function generateQuestionHash(questionText: string): string {
  // 标准化文本
  const normalized = questionText
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  // 使用简单的字符串哈希
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
}

// 获取缓存的分析结果（带降级）
export async function getCachedAnalysisWithFallback(
  questionHash: string
): Promise<CachedAnalysis["result"] | null> {
  return memoryCache.get(questionHash);
}

// 缓存分析结果（带降级）
export async function cacheAnalysisWithFallback(
  questionHash: string,
  result: CachedAnalysis["result"]
): Promise<void> {
  memoryCache.set(questionHash, result);
}

// 批量获取缓存
export async function getCachedAnalysisBatch(
  questionHashes: string[]
): Promise<Map<string, CachedAnalysis["result"]> > {
  const results = new Map<string, CachedAnalysis["result"]>();

  for (const hash of questionHashes) {
    const cached = memoryCache.get(hash);
    if (cached) {
      results.set(hash, cached);
    }
  }

  return results;
}

// 批量缓存
export async function cacheAnalysisBatch(
  items: Array<{ hash: string; result: CachedAnalysis["result"] }>
): Promise<void> {
  for (const item of items) {
    memoryCache.set(item.hash, item.result);
  }
}

// 获取缓存统计
export async function getCacheStats(): Promise<{
  memorySize: number;
  maxSize: number;
  hitRate: number;
}> {
  const stats = memoryCache.getStats();
  return {
    memorySize: stats.size,
    maxSize: stats.maxSize,
    hitRate: stats.hitRate,
  };
}

// 清除缓存
export async function clearCache(): Promise<void> {
  memoryCache.clear();
}
