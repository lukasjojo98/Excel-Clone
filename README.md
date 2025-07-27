# 🧮 Excel Clone

A lightweight web-based spreadsheet application that replicates core features of Microsoft Excel. This project is ideal for learning how spreadsheet engines work under the hood — including cell editing, data storage, and formula evaluation.

## ✨ Features

- Interactive spreadsheet grid with editable cells
- Support for entering and storing plain text or numeric values
- Formula parsing with basic function support
- Smart recalculation: **when referenced cells change, dependent formulas update automatically**
- **Builtin functions currently supported:**
  - `=SUM(A1, A2)` — Adds values from the specified cells

## 🔧 How It Works

- Cells are addressable using the standard `A1`, `B2`, `C3`, ... notation.
- You can click any cell and type in a value or a formula.
- If a formula starts with `=`, it will be parsed and evaluated.
- The app tracks cell dependencies and **recalculates any affected formulas automatically** whenever a referenced cell’s value changes.

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lukasjojo98/Excel-Clone.git
cd excel-clone
