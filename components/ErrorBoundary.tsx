import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  // FIX: Switched to class property syntax for state initialization.
  // The constructor-based approach was causing errors where `this.state` and
  // `this.props` were not recognized, likely due to a specific TypeScript
  // compiler configuration. This syntax is more modern and robust.
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-lg w-full mx-auto p-8 bg-white shadow-xl rounded-lg border border-red-300 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Ocorreu um Erro</h1>
                <p className="text-gray-700 mb-6">Lamentamos, mas algo deu errado durante o carregamento do aplicativo.</p>
                <p className="text-gray-500 text-sm mb-6">Por favor, tente recarregar a página. Se o problema persistir, entre em contato com o suporte.</p>
                {this.state.error && (
                    <details className="text-left bg-gray-50 p-3 rounded border text-xs text-gray-600 mt-4">
                        <summary className="cursor-pointer font-medium text-gray-700">Detalhes Técnicos do Erro</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-words font-mono">
                            {this.state.error.toString()}
                        </pre>
                    </details>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-150 ease-in-out"
                >
                    Recarregar Página
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
