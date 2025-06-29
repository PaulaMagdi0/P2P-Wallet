try:
    from backend.cli import seed
except ImportError:
    from cli import seed

if __name__ == "__main__":
    seed()