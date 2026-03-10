import { SetupWizard } from '@/components/setup-wizard'

export default function SetupPage() {
  return (
    <div className="max-w-xl mx-auto animate-slide-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create a New Session</h1>
        <p className="text-gray-500">Answer a few quick questions to set up your practice</p>
      </div>
      <SetupWizard />
    </div>
  )
}
