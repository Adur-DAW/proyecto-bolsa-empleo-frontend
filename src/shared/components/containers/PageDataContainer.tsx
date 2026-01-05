import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorState from '../feedback/ErrorState'
import LoadingSkeleton from '../feedback/LoadingSkeleton'

interface PageDataContainerProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ReactNode
  skeletonType?: 'list' | 'card' | 'detail'
}

export default function PageDataContainer({
  children,
  fallback,
  errorFallback,
  skeletonType = 'list'
}: PageDataContainerProps) {
  return (
    <ErrorBoundary
      fallback={errorFallback || <ErrorState />}
    >
      <Suspense fallback={fallback || <LoadingSkeleton type={skeletonType} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
