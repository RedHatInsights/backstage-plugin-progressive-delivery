# Progressive Delivery

In accordance with `SD ADR 0032`, each artifact that is a part of
delivering/operating a managed OCP cluster has to implement progressive
delivery.  This ADR was extended in `SD-ADR-0110` to provide a design for
addons.  Unfortunately, many services are not implementing this flow.  This
plugin is meant to visualize the current delivery topology for a given entity.

The progressive delivery flow is described in app-interface by defining a
target in a resource template in a `deploy.yaml` file for a given service.
Targets can `publish` and `subscribe` to various other targets, which may be
defined in other files.  This makes it difficult to track which pipelines go
where.  This plugin provides a visual representation of the collections of
piplines in order to verify a correct structure.  This plugin also shows
deployment status and latest commit sha per target so service owners can see
how far along a given deployment is.
