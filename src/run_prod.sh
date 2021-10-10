export GITCOMMIT=$(git rev-parse --short HEAD)
export GITREF="$(git log -1 --pretty=format:"%D")"
export GITTIMESTAMP="$(git log -1 --pretty=format:"%ai")"

export SITE_HOST=yourdomain.com
export AUTH_SECRET_KEY=fill_in_random_token
export EMAIL_SALT=fill_in_random_token

docker-compose -f docker-compose.yml -f docker-compose.traefik.yml  up --build
