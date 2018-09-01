import { childNumAndCatalogNum,statisticTotal,statisticCheck } from '../services/api';

export default {
  namespace: 'charts',
  state: {
    catlog1:[],
    catlog2:[],
    catlog3:[],
    check:0,
    total:0,
  },
  effects: {
    *fetchCatlog1({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum,payload);
      yield put({
        type: 'catlogNum1',
        payload: response,
      });
    },
    *fetchCatlog2({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum,payload);
      yield put({
        type: 'catlogNum2',
        payload: response,
      });
    },
    *fetchCatlog3({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum,payload);
      yield put({
        type: 'catlogNum3',
        payload: response,
      });
    },
    *catlogTotal(_, { call, put }) {
      const response = yield call(statisticTotal);
      yield put({
        type: 'total',
        payload: response,
      });
    },
    *catlogcheck({ payload }, { call, put }) {
      const response = yield call(statisticCheck,payload);
      yield put({
        type: 'check',
        payload: response,
      });
    },
  },
  reducers: {
    catlogNum1(state, { payload }) {
      return {
        ...state,
        catlog1: payload,
      };
    },
    catlogNum2(state, { payload }) {
      return {
        ...state,
        catlog2: payload,
      };
    },
    catlogNum3(state, { payload }) {
      return {
        ...state,
        catlog3: payload,
      };
    },
    total(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    check(state, { payload }) {
      return {
        ...state,
        check:payload,
      };
    },
  },
}
