import { API_FETCH } from '$lib/api';

export interface AuditLog {
	id: number;
	audit_type: string;
	user_id: string;
	action: string;
	target: string;
	status: string;
	timestamp: string;
}

export interface AuditFilterParams {
	type?: string;
	status?: string;
	timeRange?: string;
	search?: string;
}

export async function fetchAuditLogs(filters: AuditFilterParams): Promise<AuditLog[]> {
	const params = new URLSearchParams();
	if (filters.type && filters.type !== 'all') params.append('type', filters.type);
	if (filters.status && filters.status !== 'all') params.append('status', filters.status);
	if (filters.timeRange && filters.timeRange !== 'all') params.append('timeRange', filters.timeRange);
	if (filters.search?.trim()) params.append('search', filters.search.trim());

	const AuditResponseFetchData = await API_FETCH(`/routes/api/audit-logs?${params.toString()}`);

	if (!AuditResponseFetchData.ok) {
		throw new Error(`Gagal memuat data: ${AuditResponseFetchData.statusText}`);
	}

	return await AuditResponseFetchData.json();
}
