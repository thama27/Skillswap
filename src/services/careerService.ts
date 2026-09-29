import { api } from './apiClient';
import { mockCareerPaths } from '../data/mockData';
import type { CareerPath } from '../types';

export interface CareerRecommendationsResponse {
  data: CareerPath[];
  userCurrentSkills: string[];
  userCurrentInterests: string[];
  error?: string;
}

/**
 * Fetch career recommendations from Express backend /api/career-recommendations
 * with fallback to mockCareerPaths.
 */
export async function getCareerRecommendations(): Promise<CareerRecommendationsResponse> {
  try {
    const apiRes = await api.get<CareerPath[]>('/career-recommendations');
    if (apiRes.success && apiRes.data && apiRes.data.length > 0) {
      return {
        data: apiRes.data,
        userCurrentSkills: (apiRes as any).userCurrentSkills || ['Python', 'SQL', 'React'],
        userCurrentInterests: (apiRes as any).userCurrentInterests || ['AI', 'Web Development'],
      };
    }

    return {
      data: mockCareerPaths,
      userCurrentSkills: ['Python', 'Java', 'SQL'],
      userCurrentInterests: ['AI', 'Web Development'],
    };
  } catch (err: any) {
    return {
      data: mockCareerPaths,
      userCurrentSkills: ['Python', 'Java', 'SQL'],
      userCurrentInterests: ['AI', 'Web Development'],
      error: err?.message,
    };
  }
}
