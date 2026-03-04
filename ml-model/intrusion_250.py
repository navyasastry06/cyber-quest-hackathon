import pandas as pd
import random

data = []

def normal():
    return [
        random.randint(2, 15),
        random.randint(50, 500),
        random.randint(100, 1200),
        0,
        1,
        0,
        random.randint(1, 15),
        round(random.uniform(0.0, 0.2), 2),
        "Normal"
    ]

def dos():
    return [
        random.randint(0, 3),
        random.randint(5000, 15000),
        random.randint(0, 300),
        0,
        0,
        0,
        random.randint(120, 250),
        round(random.uniform(0.7, 1.0), 2),
        "DoS"
    ]

def probe():
    return [
        random.randint(1, 6),
        random.randint(100, 600),
        random.randint(50, 400),
        0,
        0,
        0,
        random.randint(30, 90),
        round(random.uniform(0.3, 0.6), 2),
        "Probe"
    ]

def r2l():
    return [
        random.randint(3, 10),
        random.randint(200, 700),
        random.randint(100, 500),
        random.randint(3, 8),
        0,
        random.randint(0, 2),
        random.randint(10, 50),
        round(random.uniform(0.2, 0.5), 2),
        "R2L"
    ]

def u2r():
    return [
        random.randint(4, 12),
        random.randint(300, 900),
        random.randint(150, 600),
        random.randint(1, 5),
        1,
        random.randint(2, 5),
        random.randint(5, 25),
        round(random.uniform(0.1, 0.4), 2),
        "U2R"
    ]

for _ in range(50):
    data.append(normal())
    data.append(dos())
    data.append(probe())
    data.append(r2l())
    data.append(u2r())

columns = [
    "duration", "src_bytes", "dst_bytes",
    "failed_logins", "logged_in",
    "num_compromised", "count",
    "srv_serror_rate", "label"
]

df = pd.DataFrame(data, columns=columns)
df = df.sample(frac=1).reset_index(drop=True)  # shuffle rows

df.to_csv("intrusion_250.csv", index=False)

print("Dataset created with", len(df), "rows")