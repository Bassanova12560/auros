"""AUROS Protocol HTTP client."""

from __future__ import annotations

from typing import Any

import httpx

DEFAULT_BASE_URL = "https://getauros.com"


class AurosProtocolError(Exception):
    def __init__(self, code: str, message: str, status: int) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status


class AurosProtocol:
    """Typed client for the AUROS Protocol REST API."""

    def __init__(
        self,
        api_key: str,
        *,
        base_url: str = DEFAULT_BASE_URL,
        client: httpx.Client | None = None,
    ) -> None:
        if not api_key or not api_key.strip():
            raise ValueError("api_key is required")
        self._api_key = api_key.strip()
        self._base_url = base_url.rstrip("/")
        self._client = client or httpx.Client(timeout=30.0)
        self._owns_client = client is None

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def __enter__(self) -> AurosProtocol:
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def score(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/score", body)

    def score_batch(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/score/batch", body)

    def score_history(self, score_id: str) -> dict[str, Any]:
        return self._request("GET", f"/api/v1/score/{score_id}/history")

    def products(self, **query: Any) -> dict[str, Any]:
        return self._get("/api/v1/products", query)

    def jurisdictions(self, **query: Any) -> dict[str, Any]:
        return self._get("/api/v1/jurisdictions", query)

    def checklist(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/checklist", body)

    def compare(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/compare", body)

    def status(self) -> dict[str, Any]:
        return self._request("GET", "/api/v1/status", auth=False)

    def monitor(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/monitor", body)

    def get_monitor(self, monitor_id: str) -> dict[str, Any]:
        return self._request("GET", f"/api/v1/monitor/{monitor_id}")

    def delete_monitor(self, monitor_id: str) -> dict[str, Any]:
        return self._request("DELETE", f"/api/v1/monitor/{monitor_id}")

    def dossier(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/dossier", body)

    def register_webhook(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/webhooks", body)

    def webhooks(self) -> dict[str, Any]:
        return self._request("GET", "/api/v1/webhooks")

    def delete_webhook(self, webhook_id: str) -> dict[str, Any]:
        return self._request("DELETE", f"/api/v1/webhooks/{webhook_id}")

    def create_key(self, email: str) -> dict[str, Any]:
        return self._request("POST", "/api/v1/keys", json={"email": email}, auth=False)

    def green_watt_score(self, reference_id: str) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/api/green/watt/{reference_id}",
            auth=False,
        )

    def green_carbon_quality(self, reference_id: str) -> dict[str, Any]:
        return self._request(
            "GET",
            f"/api/green/carbon-quality/{reference_id}",
            auth=False,
        )

    def green_watt_batch(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/green/watt/batch", body)

    def green_carbon_quality_batch(self, **body: Any) -> dict[str, Any]:
        return self._post("/api/v1/green/carbon-quality/batch", body)

    def _get(self, path: str, params: dict[str, Any]) -> dict[str, Any]:
        filtered = {k: v for k, v in params.items() if v is not None}
        return self._request("GET", path, params=filtered)

    def _post(self, path: str, body: dict[str, Any]) -> dict[str, Any]:
        filtered = {k: v for k, v in body.items() if v is not None}
        return self._request("POST", path, json=filtered)

    def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        auth: bool = True,
    ) -> dict[str, Any]:
        headers: dict[str, str] = {
            "Accept": "application/json",
            "X-AUROS-Protocol-Version": "1.0",
        }
        if json is not None:
            headers["Content-Type"] = "application/json"
        if auth:
            headers["Authorization"] = f"Bearer {self._api_key}"

        response = self._client.request(
            method,
            f"{self._base_url}{path}",
            headers=headers,
            json=json,
            params=params,
        )
        data = response.json()
        if not response.is_success:
            err = data.get("error", {}) if isinstance(data, dict) else {}
            raise AurosProtocolError(
                err.get("code", "unknown_error"),
                err.get("message", "Request failed"),
                response.status_code,
            )
        return data
