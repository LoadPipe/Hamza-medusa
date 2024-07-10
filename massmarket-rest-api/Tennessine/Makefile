# SPDX-FileCopyrightText: 2024 Mass Labs
#
# SPDX-License-Identifier: Unlicense

.phony: reuse

CPY := "Mass Labs"

reuse:
	reuse annotate --license Unlicense --copyright $(CPY) --merge-copyrights Makefile README.md flake.nix package.json tsconfig.json pnpm-*.yaml .gitignore

	git ls-files packages/client > /tmp/client_files
	cat /tmp/client_files | xargs reuse annotate --license MIT --copyright $(CPY) --merge-copyrights

	git ls-files packages/contracts > /tmp/client_files
	cat /tmp/client_files | xargs reuse annotate --license Unlicense --copyright $(CPY) --merge-copyrights

	find packages/frontend -name '*.ts' \
		-or -name '*.tsx' \
		-or -name '*.js' \
		-or -name '*.css' \
		-or -name '*.yaml' \
		-or -name '*.json' \
		-or -name 'README.md' \
		| grep -vE '(node_modules|.next)' > /tmp/frontend_files
	cat /tmp/frontend_files | xargs reuse annotate --license GPL-3.0-or-later --copyright $(CPY) --merge-copyrights
	
	# TODO: properly license frontend assets
