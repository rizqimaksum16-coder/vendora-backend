<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index() {
        return Transaction::all();
    }

    public function store(Request $request) {
        $request->validate([
            'productName'   => 'required|string',
            'price'         => 'required|string',
            'name'          => 'required|string',
            'phone'         => 'required|string',
            'address'       => 'required|string',
            'paymentMethod' => 'required|string',
            'status'        => 'sometimes|string',
        ]);

        return Transaction::create($request->all());
    }

    public function update(Request $request, $id) {
        $transaction = Transaction::find($id);
        $transaction->update($request->all());
        return $transaction;
    }

    public function destroy($id) {
        return Transaction::destroy($id);
    }
}