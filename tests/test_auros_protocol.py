"""Smoke tests for the auros-protocol Python SDK."""

from __future__ import annotations

import unittest
from unittest.mock import MagicMock, patch

from auros import AurosProtocol, AurosProtocolError


class AurosProtocolClientTest(unittest.TestCase):
    def test_requires_api_key(self) -> None:
        with self.assertRaises(ValueError):
            AurosProtocol(api_key="")

    @patch("auros.client.httpx.Client")
    def test_score_posts_with_bearer(self, client_cls: MagicMock) -> None:
        http = MagicMock()
        client_cls.return_value = http
        http.request.return_value = MagicMock(
            is_success=True,
            status_code=200,
            json=lambda: {"score": 72, "grade": "B"},
        )

        client = AurosProtocol(api_key="auros_pk_test_demo")
        result = client.score(description="Luxembourg SPV")

        self.assertEqual(result["score"], 72)
        call = http.request.call_args
        self.assertEqual(call.args[0], "POST")
        self.assertIn("/api/v1/score", call.args[1])
        self.assertEqual(call.kwargs["headers"]["Authorization"], "Bearer auros_pk_test_demo")

    @patch("auros.client.httpx.Client")
    def test_status_skips_auth(self, client_cls: MagicMock) -> None:
        http = MagicMock()
        client_cls.return_value = http
        http.request.return_value = MagicMock(
            is_success=True,
            status_code=200,
            json=lambda: {"status": "operational", "version": "1.0"},
        )

        client = AurosProtocol(api_key="auros_pk_test_demo")
        result = client.status()

        self.assertEqual(result["status"], "operational")
        headers = http.request.call_args.kwargs["headers"]
        self.assertNotIn("Authorization", headers)

    @patch("auros.client.httpx.Client")
    def test_compare_posts_body(self, client_cls: MagicMock) -> None:
        http = MagicMock()
        client_cls.return_value = http
        http.request.return_value = MagicMock(
            is_success=True,
            status_code=200,
            json=lambda: {"products": [], "comparison": {"product_count": 0}},
        )

        client = AurosProtocol(api_key="auros_pk_test_demo")
        client.compare(category="bonds", yield_min=4, limit=3)

        call = http.request.call_args
        self.assertEqual(call.args[0], "POST")
        self.assertIn("/api/v1/compare", call.args[1])
        self.assertEqual(call.kwargs["json"]["category"], "bonds")

    @patch("auros.client.httpx.Client")
    def test_raises_protocol_error(self, client_cls: MagicMock) -> None:
        http = MagicMock()
        client_cls.return_value = http
        http.request.return_value = MagicMock(
            is_success=False,
            status_code=401,
            json=lambda: {"error": {"code": "unauthorized", "message": "Invalid key"}},
        )

        client = AurosProtocol(api_key="bad")
        with self.assertRaises(AurosProtocolError) as ctx:
            client.products()

        self.assertEqual(ctx.exception.code, "unauthorized")
        self.assertEqual(ctx.exception.status, 401)


if __name__ == "__main__":
    unittest.main()
