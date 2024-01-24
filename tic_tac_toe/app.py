from flask import Flask, render_template, jsonify, request

app = Flask(__name__, template_folder='templates', static_folder='static')

# Initialize an empty Tic-Tac-Toe board
board = [[' ' for _ in range(3)] for _ in range(3)]
current_player = 'X'

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/move", methods=['POST'])
def make_move():
    global current_player

    # Get the move data from the frontend
    data = request.get_json()
    row, col = data['row'], data['col']

    # Check if the chosen cell is empty
    if board[row][col] == ' ':
        # Update the board with the current player's move
        board[row][col] = current_player

        # Check for a winner
        winner = check_winner()
        if winner:
            return jsonify({'result': 'win', 'winner': winner})
        
        # Check for a draw
        if is_board_full():
            return jsonify({'result': 'draw'})
        
        # Switch to the other player
        current_player = 'O' if current_player == 'X' else 'X'
        
        # Return the updated board
        return jsonify({'result': 'success', 'board': board})
    else:
        # If the cell is already occupied, return an error
        return jsonify({'result': 'error', 'message': 'Cell already occupied'})

def check_winner():
    # Check rows, columns, and diagonals for a win
    for i in range(3):
        if all(cell == current_player for cell in board[i]) or all(board[j][i] == current_player for j in range(3)):
            return current_player
    if all(board[i][i] == current_player for i in range(3)) or all(board[i][2 - i] == current_player for i in range(3)):
        return current_player
    return None

def is_board_full():
    # Check if the board is full
    return all(cell != ' ' for row in board for cell in row)

if __name__ == "__main__":
    app.run(debug=True)
