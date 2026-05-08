export interface Brand {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo_url: string | null;
    display_order: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export default Brand;
