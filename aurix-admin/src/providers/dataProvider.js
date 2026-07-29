import { fetchUtils } from 'react-admin';
import { getResourceUrl } from '../config/resources';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json', 'Content-Type': 'application/json' });
  }
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  return fetchUtils.fetchJson(url, options);
};

const ensureId = (record) => {
  if (!record) return record;
  if (record.id != null) return record;
  const id = record.codigo ?? record.codigoRelatorio ?? record.endToEndId ?? record.numeroControle;
  return id != null ? { ...record, id } : record;
};

const normalizeListResponse = (json, params) => {
  let data = [];
  if (Array.isArray(json)) data = json;
  else if (json.content !== undefined) data = json.content;
  else data = Array.isArray(json) ? json : [json];
  const total = Array.isArray(json) ? json.length : (json.totalElements ?? data.length);
  return { data: data.map(ensureId), total };
};

export const dataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${getResourceUrl(resource)}?${new URLSearchParams(query)}`;
    return httpClient(url).then(({ headers, json }) => {
      const normalized = normalizeListResponse(json, params);
      const total = headers.get('content-range') ? parseInt(headers.get('content-range').split('/').pop(), 10) : normalized.total;
      return { data: normalized.data, total };
    }).catch((e) => {
      if (e.status === 404 || e.status === 403) return { data: [], total: 0 };
      throw e;
    });
  },

  getOne: (resource, params) =>
    httpClient(getResourceUrl(resource, params.id)).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    const url = `${getResourceUrl(resource)}?${new URLSearchParams(query)}`;
    return httpClient(url).then(({ json }) => {
      const data = Array.isArray(json) ? json : (json.content || []);
      return { data };
    });
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
    };
    const url = `${getResourceUrl(resource)}?${new URLSearchParams(query)}`;
    return httpClient(url).then(({ headers, json }) => {
      const normalized = normalizeListResponse(json, params);
      const total = headers.get('content-range') ? parseInt(headers.get('content-range').split('/').pop(), 10) : normalized.total;
      return { data: normalized.data, total };
    });
  },

  create: (resource, params) =>
    httpClient(getResourceUrl(resource), {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id ?? json.id },
    })),

  update: (resource, params) =>
    httpClient(getResourceUrl(resource, params.id), {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  updateMany: (resource, params) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    return httpClient(`${getResourceUrl(resource)}?${new URLSearchParams(query)}`, {
      method: 'PATCH',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  delete: (resource, params) =>
    httpClient(getResourceUrl(resource, params.id), {
      method: 'DELETE',
    }).then(() => ({ data: params.previousData })),

  deleteMany: (resource, params) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    return httpClient(`${getResourceUrl(resource)}?${new URLSearchParams(query)}`, {
      method: 'DELETE',
    }).then(() => ({ data: params.ids }));
  },
};
