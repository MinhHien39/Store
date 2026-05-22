export interface ProductViewStats {
    product_id: number;
    product_name: string;
    total_views: number;
    authenticated_views: number;
    anonymous_views: number;
    unique_visitors: number;
    web_views: number;
    mobile_views: number;
    desktop_views: number;
    tablet_views: number;
    latest_ip_address: string | null;
    latest_source: string | null;
    latest_device_type: string | null;
    latest_browser: string | null;
    latest_os: string | null;
    latest_viewed_at: string | null;
}

export interface ProductViewChartItem {
    product_id: number;
    product_name: string;
    total_views: number;
    authenticated_views: number;
    anonymous_views: number;
    unique_visitors: number;
    mobile_views: number;
    desktop_views: number;
    tablet_views: number;
    latest_ip_address: string | null;
    latest_source: string | null;
    latest_device_type: string | null;
    latest_browser: string | null;
    latest_os: string | null;
    latest_viewed_at: string | null;
}

export interface ProductViewStatsSummary {
    total_views: number;
    authenticated_views: number;
    anonymous_views: number;
    unique_visitors: number;
    web_views: number;
    mobile_views: number;
    desktop_views: number;
    tablet_views: number;
}

export default ProductViewStats;
