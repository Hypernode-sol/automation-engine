# scripts/test_conversion.py
# Demonstrates a mock conversion of points -> HYPER via x402 parameters.

def convert_points_to_hyper(points: float, alpha: float = 0.001, reputation: float = 1.0) -> float:
    """
    Conversion mock:
    HYPER = points * alpha * reputation
    Alpha and reputation would be read from on-chain or protocol parameters in production.
    """
    return max(points, 0.0) * max(alpha, 0.0) * max(reputation, 0.0)

if __name__ == "__main__":
    sample = 10_000.0
    hyper = convert_points_to_hyper(sample, alpha=0.002, reputation=0.95)
    print(f"points={sample} -> HYPER={hyper:.6f}")
