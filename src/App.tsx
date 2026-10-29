import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Roadmap from './pages/Roadmap'
import StepPage from './pages/StepPage'
import QuizPage from './pages/QuizPage'
import PracticePage from './pages/PracticePage'
import ReviewPage from './pages/ReviewPage'
import ExamPage from './pages/ExamPage'
import ExamResultPage from './pages/ExamResultPage'
import InfoPage from './pages/InfoPage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Roadmap />} />
          <Route path="step/:stepId" element={<StepPage />} />
          <Route path="quiz/step/:stepId" element={<QuizPage key="step" kind="step" />} />
          <Route path="quiz/domain/:domainId" element={<QuizPage key="domain" kind="domain" />} />
          <Route path="quiz/mistakes" element={<QuizPage key="mistakes" kind="mistakes" />} />
          <Route path="quiz/practice" element={<QuizPage key="practice" kind="practice" />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="exam" element={<ExamPage />} />
          <Route path="exam/result/:attemptId" element={<ExamResultPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Roadmap />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
