import { catalogList,catalogListTree,querycatalogItem ,tableField,itemField,
  catalogApi,catalogCollection,catalogFile,} from '../services/api';

export default {
  namespace: 'catalog',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    treeData:[],
    catalogItem:[],
    field:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(catalogList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *tree({ payload,callback }, { call, put }) {
      const response = yield call(catalogListTree, payload);
      yield put({
        type: 'treeData',
        payload: response,
      });
      if (callback) callback(response);
    },
    *querycatalogItem({ payload }, { call, put }) {
      const response = yield call(querycatalogItem, payload);
      yield put({
        type: 'catalogItem',
        payload: response,
      });
    },
    *tableField({ payload }, { call, put }) {
      const response = yield call(tableField, payload);
      yield put({
        type: 'field',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getresourceclassify, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(itemField, payload);
      if (callback) callback();
    },
    *catalogApi({ payload, callback }, { call, put }) {
      const response = yield call(catalogApi, payload);
      if (callback) callback();
    },
    *catalogCollection({ payload, callback }, { call, put }) {
      const response = yield call(catalogCollection, payload);
      if (callback) callback();
    },
    *catalogFile({ payload, callback }, { call, put }) {
      const response = yield call(catalogFile, payload);
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateresourceclassify, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *querycatalogItemCopy({ payload, callback }, { call, put }) {
      yield put({
        type: 'catalogItemCopy',
        payload: payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    catalogItem(state, action){
      return {
        ...state,
        catalogItem: action.payload,
      };
    },
    catalogItemCopy(state, action){
      return {
        ...state,
        catalogItem: action.payload,
      };
    },
    field(state, action){
      return {
        ...state,
        field: action.payload,
      };
    },
    treeData(state, action){
      return {
        ...state,
        treeData: action.payload,
      };
    },
    get(state, action){
      return {
        ...state,
        treeData: action.payload,
      };
    }
  },
};
