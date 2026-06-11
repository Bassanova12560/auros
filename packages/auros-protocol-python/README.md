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

| Method | Endpoint |
|--------|----------|
| `score(**fields)` | `POST /api/v1/score` |
| `products(**query)` | `GET /api/v1/products` |
| `jurisdictions(**query)` | `GET /api/v1/jurisdictions` |
| `checklist(**body)` | `POST /api/v1/checklist` |
| `create_key(email)` | `POST /api/v1/keys` |

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

# Free API key
key_resp = client.create_key("you@company.com")
print(key_resp["api_key"])
```

## Context manager

```python
with AurosProtocol(api_key="auros_pk_test_demo") as client:
    print(client.score(description="..."))
```

## Disclaimer

Indicative intelligence only — not legal, tax, or investment advice.
