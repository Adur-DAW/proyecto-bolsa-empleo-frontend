import { ErrorBoundary, FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { PropsWithChildren } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Alert, Button } from '@mui/material';

const ErrorFallback = ({ error }: FallbackProps) => {
	const { resetBoundary } = useErrorBoundary();

	return (
		<Alert>
			<p>Algo ha pasado:</p>
			<pre style={{ color: 'red' }}>{error.message}</pre>
			<Button onClick={resetBoundary}>Volver a intentar</Button>
		</Alert>
	);
};

export function CustomErrorBoundary({ children }: PropsWithChildren) {
	const { reset } = useQueryErrorResetBoundary();

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={reset}>
			{children}
		</ErrorBoundary>
	);
}
