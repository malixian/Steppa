import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let startPage: String

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        loadStartPage(in: webView)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    private func loadStartPage(in webView: WKWebView) {
        guard
            let webRoot = Bundle.main.resourceURL?.appendingPathComponent("Web", isDirectory: true),
            let indexURL = Bundle.main.url(forResource: startPage, withExtension: "html", subdirectory: "Web")
        else {
            webView.loadHTMLString("<h1>Steppa resources not found</h1>", baseURL: nil)
            return
        }

        webView.loadFileURL(indexURL, allowingReadAccessTo: webRoot)
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }

            if url.isFileURL || url.scheme == "about" {
                decisionHandler(.allow)
                return
            }

            UIApplication.shared.open(url)
            decisionHandler(.cancel)
        }
    }
}
