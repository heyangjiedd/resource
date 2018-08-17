import { deriveList,getderivecatalog,removederivecatalog,deriveApi,deriveCollection,deriveFile,deriveField} from '../services/api';

export default {
  namespace: 'dervieSource',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //取数据源列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(deriveList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(getderivecatalog, payload);
      yield put({
        type: 'get',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removederivecatalog, payload);
      if (callback) callback();
    },
    *api({ payload, callback }, { call, put }) {
      const response = yield call(deriveApi, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *collection({ payload, callback }, { call, put }) {
      const response = yield call(deriveCollection, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *file({ payload, callback }, { call, put }) {
      const response = yield call(deriveFile, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *field({ payload, callback }, { call, put }) {
      const response = yield call(deriveField, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    get(state, action){
      return {
        ...state,
        detail: action.payload,
      };
    }
  },
};
