/**
 * Event Dispatcher Service for RaktDal
 *
 * Provides a clean decoupled interface for emitting application domain events
 * (e.g. blood request creation, responses, status transitions, fulfillment)
 * without prematurely coupling or duplicating the upcoming Phase notification module.
 */

class EventDispatcher {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(handler);
    return () => this.off(eventName, handler);
  }

  subscribe(eventName, handler) {
    return this.on(eventName, handler);
  }

  off(eventName, handler) {
    if (!this.listeners.has(eventName)) return;
    const handlers = this.listeners.get(eventName).filter(h => h !== handler);
    this.listeners.set(eventName, handlers);
  }

  async emit(eventName, eventData) {
    const timestamp = new Date().toISOString();
    console.log(`[DOMAIN EVENT: ${eventName}] ${timestamp}`, {
      eventId: eventData.id || eventData._id || "N/A",
      type: eventName,
      summary: eventData.summary || "Domain event triggered"
    });

    const handlers = this.listeners.get(eventName) || [];
    for (const handler of handlers) {
      try {
        await handler(eventData);
      } catch (err) {
        console.error(`Error in event listener for [${eventName}]:`, err.message);
      }
    }
  }

  async publish(eventName, eventData) {
    return this.emit(eventName, eventData);
  }
}

export const eventDispatcher = new EventDispatcher();

// Standard Domain Event Constants
export const DOMAIN_EVENTS = {
  REQUEST_CREATED: "blood_request.created",
  REQUEST_APPROVED: "blood_request.approved",
  REQUEST_REJECTED: "blood_request.rejected",
  REQUEST_STATUS_CHANGED: "blood_request.status_changed",
  REQUEST_FULFILLED: "blood_request.fulfilled",
  REQUEST_CANCELLED: "blood_request.cancelled",
  RESPONSE_SUBMITTED: "request_response.submitted",
  RESPONSE_STATUS_CHANGED: "request_response.status_changed"
};
