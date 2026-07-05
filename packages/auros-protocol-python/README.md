# auros-protocol (Python)

Official Python SDK for the [AUROS Protocol](https://getauros.com/developers).

## Install

```bash
pip install auros-protocol
```

Or from source:

```bash
cd packages/auros-protocol-python
pip install -e .
```

## Quickstart

```python
from auros import AurosProtocol

client = AurosProtocol(api_key="auros_pk_test_demo")

result = client.score(
    description="Retail warehouse Luxembourg €2.5M SPV professional investors"
)
print(result["score"], result["grade"], result["mica_classification"])
```

## Methods

| Method | Endpoint | Auth |
|--------|----------|------|
| `score(**fields)` | `POST /api/v1/score` | Bearer |
| `score_batch(**body)` | `POST /api/v1/score/batch` | Bearer |
| `products(**query)` | `GET /api/v1/products` | Bearer |
| `jurisdictions(**query)` | `GET /api/v1/jurisdictions` | Bearer |
| `checklist(**body)` | `POST /api/v1/checklist` | Bearer |
| `compare(**body)` | `POST /api/v1/compare` | Bearer |
| `status()` | `GET /api/v1/status` | None |
| `create_key(email)` | `POST /api/v1/keys` | None |
| `green_watt_score(id)` | `GET /api/green/watt/{id}` | None |
| `green_carbon_quality(id)` | `GET /api/green/carbon-quality/{id}` | None |
| `green_watt_batch(**body)` | `POST /api/v1/green/watt/batch` | Bearer |
| `green_carbon_quality_batch(**body)` | `POST /api/v1/green/carbon-quality/batch` | Bearer |

## Examples

```python
# Catalog
bonds = client.products(category="bonds", yield_min=4, limit=10)

# Jurisdictions
ranking = client.jurisdictions(
    asset_type="real_estate",
    investor_type="professional",
    timeline_months=6,
)

# Checklist
items = client.checklist(
    asset_type="real_estate",
    jurisdiction="luxembourg",
    structure="spv",
)

# Compare RWA products
comparison = client.compare(category="bonds", yield_min=4, limit=3)

# API health (no auth)
health = client.status()
print(health["status"], health["version"])

# Free API key
key_resp = client.create_key("you@company.com")
print(key_resp["api_key"])

# Green scoring
watt = client.green_watt_score("sunexchange")
print(watt["watt_score"]["rating"])

batch = client.green_watt_batch(
    items=[
        {"id": "sunexchange"},
        {"text": "Solar farm 12 MW PPA production MWh"},
    ]
)
print(batch["succeeded"])
```

## Context manager

```python
with AurosProtocol(api_key="auros_pk_test_demo") as client:
    print(client.score(description="..."))
```

## Disclaimer

Indicative intelligence only — not legal, tax, or investment advice.

## Publish (maintainers)

```bash
cd packages/auros-protocol-python
python -m pip install --upgrade build twine
python -m build
python -m twine upload dist/*
```

Set `TWINE_USERNAME=__token__` and `TWINE_PASSWORD=pypi-<your-api-token>` before upload.
