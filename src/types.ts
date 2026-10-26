export type ServiceStatus = 'draft' | 'published' | 'deleted';

export interface Service {
  id: number;
  title: string;
  description: string;
  status: ServiceStatus;
  kpd: number | null;
  price: number | null;
  image_url: string | null;
  video_url: string | null;
  creator_id: number;
  is_own: 0 | 1;
  likes_count: number;
  created_at: string;
  updated_at: string;
}
