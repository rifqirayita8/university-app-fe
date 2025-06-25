import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from '@/views/HomePage.vue'
import UniversityPage from '@/views/UniversityPage.vue'
import RecommendationPage from '@/views/RecommendationPage.vue'
import UniversityDetail from '@/views/UniversityDetail.vue'

const routes= [
  {path: '/', name: 'home', component: HomePage },
  {path: '/recommendation', name: 'recommendation', component: RecommendationPage },
  {path: '/university', name: 'university', component: UniversityPage },
  {path: '/university/:id', name: 'university-detail', component: UniversityDetail },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
