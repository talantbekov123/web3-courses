test details
forge test -vvvv --match-path test/Test.t.sol
Когда ваш контракт наследует is Test, вы получаете доступ к набору утилит:

bound(value, min, max) — ограничивает случайное значение в диапазон
assertEq(a, b) — проверяет равенство
vm.prank(address) — притворяется другим адресом
vm.warp(timestamp) — перематывает время
vm.deal(address, amount) — даёт ETH адресу
vm.expectRevert(...) — ожидает revert


Foundry
- быстрее на Rust
- нативный solidity тесты
- можно увидеть детализацию каждого вызова через -vvvv

Встроенный в foundry но тоже есть в hardhat
- Встроенный fuzzing — сотни рандомных инпутов за секунды
- Cheatcodes (vm.prank, vm.warp, vm.deal) — мощные утилиты для тестов