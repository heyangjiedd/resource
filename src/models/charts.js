import {
  childNumAndCatalogNum,
  statisticTotal,
  statisticCheck,
  dataSourceCount,
  halfYearCount,
  deriveClassifyCount,
  deriveClassify,
} from '../services/api';

export default {
  namespace: 'charts',
  state: {
    catlog1: [],
    catlog2: [],
    catlog3: [],
    check: 0,
    total: 0,
    dataCount: [],
    halfYear1: [],
    halfYear2: [],
    halfYear3: [],
    deriveCount: {},
    deriveClassify:[],
  },
  effects: {
    * deriveClassify({ payload }, { call, put }) {
      const response = yield call(deriveClassify, payload);
      yield put({
        type: 'deriveClass',
        payload: response,
      });
    },
    * deriveClassifyCount({ payload }, { call, put }) {
      const response = yield call(deriveClassifyCount, payload);
      yield put({
        type: 'deriveCount',
        payload: response,
      });
    },
    * halfYearCount1({ payload }, { call, put }) {
      const response = yield call(halfYearCount, payload);
      yield put({
        type: 'year1',
        payload: response,
      });
    },
    * halfYearCount2({ payload }, { call, put }) {
      const response = yield call(halfYearCount, payload);
      yield put({
        type: 'year2',
        payload: response,
      });
    },
    * halfYearCount3({ payload }, { call, put }) {
      const response = yield call(halfYearCount, payload);
      yield put({
        type: 'year3',
        payload: response,
      });
    },
    * fetchCatlog1({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum, payload);
      yield put({
        type: 'catlogNum1',
        payload: response,
      });
    },
    * fetchCatlog2({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum, payload);
      yield put({
        type: 'catlogNum2',
        payload: response,
      });
    },
    * fetchCatlog3({ payload }, { call, put }) {
      const response = yield call(childNumAndCatalogNum, payload);
      yield put({
        type: 'catlogNum3',
        payload: response,
      });
    },
    * catlogTotal(_, { call, put }) {
      const response = yield call(statisticTotal);
      yield put({
        type: 'total',
        payload: response,
      });
    },
    * catlogcheck({ payload }, { call, put }) {
      const response = yield call(statisticCheck, payload);
      yield put({
        type: 'check',
        payload: response,
      });
    },
    * dataSourceCount({ payload }, { call, put }) {
      const response = yield call(dataSourceCount, payload);
      yield put({
        type: 'count',
        payload: response,
      });
    },

  },
  reducers: {
    deriveClass(state, { payload }) {
      return {
        ...state,
        deriveClassify: payload,
      };
    },
    deriveCount(state, { payload }) {
      return {
        ...state,
        deriveCount: payload,
      };
    },
    year1(state, { payload }) {
      return {
        ...state,
        halfYear1: payload,
      };
    },
    year2(state, { payload }) {
      return {
        ...state,
        halfYear2: payload,
      };
    },
    year3(state, { payload }) {
      return {
        ...state,
        halfYear3: payload,
      };
    },
    count(state, { payload }) {
      return {
        ...state,
        dataCount: payload,
      };
    },
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
        check: payload,
      };
    },
  },
};
