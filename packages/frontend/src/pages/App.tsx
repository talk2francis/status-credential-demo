import { Routes, Route } from 'react-router-dom'
import { Landing } from './Landing'
import { Catalog } from './Catalog'
import { CourseDetail } from './CourseDetail'
import { CoursePlayer } from './CoursePlayer'
import { Sandbox } from './Sandbox'
import { Dashboard } from './Dashboard'
import { Assessments } from './Assessments'
import { Layout } from '../components/Layout'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/player" element={<CoursePlayer />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/assessments" element={<Assessments />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
