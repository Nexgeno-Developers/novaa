import { configureStore } from '@reduxjs/toolkit'
import curatedReducer from './slices/collectionSlice'
import authReducer from './slices/authSlice';
import navbarReducer from './slices/navbarSlice'
import homeReducer from './slices/homeSlice';
import mediaReducer from './slices/mediaSlice'
import aboutReducer from './slices/aboutSlice'
import whyInvestReducer from './slices/whyInvestSlice'
import propertiesReducer from './slices/propertiesSlice'
import advantageReducer from './slices/advantageSlice'
import faqReducer from './slices/faqslice'
import testimonialReducer from './slices/testimonialsSlice'
import investorReducer from './slices/investorInsightsSlice'
import pageReducer from './slices/pageSlice'
import breadcrumbReducer from './slices/breadcrumbSlice'


export const store = configureStore({
  reducer: {
    curated: curatedReducer,
    auth: authReducer,
    navbar: navbarReducer,
    home: homeReducer,
    media : mediaReducer,
    about : aboutReducer,
    whyInvest : whyInvestReducer,
    properties : propertiesReducer,
    advantage : advantageReducer,
    faq: faqReducer,
    testimonials:testimonialReducer,
    investor:investorReducer,
      pages: pageReducer,
          breadcrumb: breadcrumbReducer,



  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
