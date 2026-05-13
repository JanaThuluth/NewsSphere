import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 15 * 60 * 1000;

interface CacheData {
    data: any;
    timestamp: number;
}

export const cacheUtils = {
    setCacheData: async (key: string, data: any) => {
        try {
            const cacheData: CacheData = {
                data,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    },

    getCacheData: async (key: string) => {
        try {
            const cached = await AsyncStorage.getItem(key);
            if (!cached) return null;

            const { data, timestamp }: CacheData = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > CACHE_DURATION;

            if (isExpired) {
                await AsyncStorage.removeItem(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    clearAllCache: async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('news_cache_'));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    },
};

const pendingRequests = new Map<string, Promise<any>>();

export const dedupRequest = async (
    key: string,
    requestFn: () => Promise<any>
) => {
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const promise = requestFn()
        .finally(() => {
            pendingRequests.delete(key);
        });

    pendingRequests.set(key, promise);
    return promise;
};
